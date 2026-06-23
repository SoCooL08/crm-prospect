import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    parola_setata: !!process.env.CRM_PAROLA,
    parola_length: process.env.CRM_PAROLA?.length ?? 0,
    parola_preview: process.env.CRM_PAROLA?.slice(0, 3) ?? "undefined",
  });
}
