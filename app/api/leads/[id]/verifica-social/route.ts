import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: lead } = await supabaseAdmin
    .from("leads")
    .select("website")
    .eq("id", id)
    .single();

  if (!lead?.website) {
    return NextResponse.json({ error: "Lead-ul nu are website" }, { status: 400 });
  }

  let url = lead.website.trim();
  if (!url.startsWith("http")) url = "https://" + url;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = await res.text();

    // Extract Facebook URL (exclude generic FB links)
    const fbRaw = html.match(
      /https?:\/\/(www\.)?facebook\.com\/(?!sharer|share|plugins|login|photo|video|events|groups\/feed|help|policy|legal|ads|business)[a-zA-Z0-9._%-]{3,}/
    );
    // Extract Instagram URL
    const igRaw = html.match(
      /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]{2,}/
    );

    const facebook_url = fbRaw ? fbRaw[0].replace(/[/?#].*$/, "").replace(/\/$/, "") : null;
    const instagram_url = igRaw ? igRaw[0].replace(/[/?#].*$/, "").replace(/\/$/, "") : null;

    // Try to save — silently ignore if columns don't exist yet
    try {
      await supabaseAdmin
        .from("leads")
        .update({ facebook_url, instagram_url })
        .eq("id", id);
    } catch {}

    return NextResponse.json({ facebook_url, instagram_url, gasit: !!(facebook_url || instagram_url) });
  } catch {
    return NextResponse.json({ error: "Nu s-a putut accesa website-ul", gasit: false }, { status: 502 });
  }
}
