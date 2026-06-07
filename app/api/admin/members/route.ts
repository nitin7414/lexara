import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "GET org members (Under construction)" });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: "POST org member / invite (Under construction)" });
}

export async function DELETE(request: Request) {
  return NextResponse.json({ message: "DELETE org member (Under construction)" });
}
