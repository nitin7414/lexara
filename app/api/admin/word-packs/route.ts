import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "GET org word packs (Under construction)" });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "POST org word pack (Under construction)" });
}
