import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const placeName = searchParams.get("query");

  if (!placeName) {
    return NextResponse.json(
      { error: "Missing query parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_API_KEY;

  // ❗ ถ้า apiKey เป็น undefined → แปลว่า env ยังตั้งผิด
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing GOOGLE_API_KEY in env" },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    placeName
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}