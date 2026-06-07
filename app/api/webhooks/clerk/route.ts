/**
 * CLERK WEBHOOK CONFIGURATION INSTRUCTIONS:
 * 
 * 1. Go to the Clerk Dashboard -> Webhooks -> Add Endpoint.
 * 2. Set the Endpoint URL to: https://<your-domain>/api/webhooks/clerk
 * 3. Select the following events to subscribe to:
 *    - user.created
 *    - user.updated
 *    - user.deleted
 *    - organization.created
 *    - organizationMembership.created
 *    - organizationMembership.deleted
 * 4. Copy the Signing Secret (starts with `whsec_`) and save it in your `.env` or `.env.local`
 *    as `CLERK_WEBHOOK_SECRET`.
 */

import { headers } from "next/headers";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { OrgType } from "@prisma/client";

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable.");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers asynchronously (required in Next.js 16)
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Webhook signature verification failed in development. Proceeding anyway with raw payload.", err);
      evt = payload as WebhookEvent;
    } else {
      console.error("Error verifying webhook signature:", err);
      return new Response("Error occurred -- verification failed", {
        status: 400,
      });
    }
  }

  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      
      const email = email_addresses?.[0]?.email_address || `${id}@placeholder.lexara.com`;

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: email,
          name: name,
          imageUrl: image_url || null,
        },
        create: {
          clerkId: id,
          email: email,
          name: name,
          imageUrl: image_url || null,
          role: "INDEPENDENT",
          streak: {
            create: {
              currentStreak: 0,
              longestStreak: 0,
              totalDaysCompleted: 0,
            },
          },
        },
      });

      return new Response("User successfully synced", { status: 200 });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses?.[0]?.email_address || `${id}@placeholder.lexara.com`;

      const name = [first_name, last_name].filter(Boolean).join(" ") || null;

      await prisma.user.update({
        where: { clerkId: id },
        data: {
          email: email,
          name: name,
          imageUrl: image_url || null,
        },
      });

      return new Response("User successfully updated", { status: 200 });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        return new Response("Missing user id", { status: 400 });
      }

      await prisma.user.delete({
        where: { clerkId: id },
      });

      return new Response("User successfully deleted", { status: 200 });
    }

    if (eventType === "organization.created") {
      const { id, name, slug, created_by, public_metadata } = evt.data;

      if (!id || !name || !slug) {
        return new Response("Missing organization parameters", { status: 400 });
      }

      // Map public_metadata.type to OrgType, default to SCHOOL
      let orgType: OrgType = OrgType.SCHOOL;
      const metadata = public_metadata as { type?: string } | undefined;
      if (metadata?.type === "COACHING") orgType = OrgType.COACHING;
      else if (metadata?.type === "CORPORATE") orgType = OrgType.CORPORATE;

      const org = await prisma.organization.upsert({
        where: { clerkOrgId: id },
        update: {
          name: name,
          slug: slug,
          type: orgType,
        },
        create: {
          clerkOrgId: id,
          name: name,
          slug: slug,
          type: orgType,
        },
      });

      if (created_by) {
        await prisma.user.update({
          where: { clerkId: created_by },
          data: {
            role: "ORG_ADMIN",
            organizationId: org.id,
          },
        });
      }

      return new Response("Organization successfully created", { status: 200 });
    }

    if (eventType === "organizationMembership.created") {
      const { organization, public_user_data } = evt.data;

      const clerkOrgId = organization?.id;
      const clerkUserId = public_user_data?.user_id;

      if (!clerkOrgId || !clerkUserId) {
        return new Response("Missing membership parameters", { status: 400 });
      }

      const org = await prisma.organization.findUnique({
        where: { clerkOrgId },
      });

      if (!org) {
        return new Response("Organization not found in database", { status: 404 });
      }

      await prisma.user.update({
        where: { clerkId: clerkUserId },
        data: {
          organizationId: org.id,
          role: "ORG_MEMBER",
        },
      });

      return new Response("Membership successfully created", { status: 200 });
    }

    if (eventType === "organizationMembership.deleted") {
      const { public_user_data } = evt.data;

      const clerkUserId = public_user_data?.user_id;

      if (!clerkUserId) {
        return new Response("Missing user id parameters", { status: 400 });
      }

      await prisma.user.update({
        where: { clerkId: clerkUserId },
        data: {
          organizationId: null,
          role: "INDEPENDENT",
        },
      });

      return new Response("Membership successfully deleted", { status: 200 });
    }

    return new Response("Event received but not handled", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook database operations:", error);
    return new Response("Internal Server Error processing database updates", {
      status: 500,
    });
  }
}
