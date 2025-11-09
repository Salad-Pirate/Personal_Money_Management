import Tesseract from "tesseract.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert image to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Run OCR locally
    const result = await Tesseract.recognize(buffer, "eng", {
      logger: (m) => console.log(m), // optional: shows progress
    });

    return NextResponse.json({
      text: result.data.text,
      confidence: result.data.confidence,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}