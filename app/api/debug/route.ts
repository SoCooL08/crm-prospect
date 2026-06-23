import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("crm_auth")?.value;
  const parola = process.env.CRM_PAROLA;
  return NextResponse.json({
    parola_length: parola?.length ?? 0,
    parola_value: parola,
    cookie_value: cookie,
    match: cookie === parola,
  });
}
