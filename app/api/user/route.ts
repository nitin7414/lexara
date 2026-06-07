import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "GET user profile (Under construction)" });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "POST user profile (Under construction)" });
}
