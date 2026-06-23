import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { parola } = await req.json();

  if (parola !== process.env.CRM_PAROLA) {
    return NextResponse.json({ error: "Parola gresita" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("crm_auth", process.env.CRM_PAROLA!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 zile
    path: "/",
  });
  return res;
}
