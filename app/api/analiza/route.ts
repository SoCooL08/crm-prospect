import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const KEY = process.env.GOOGLE_API_KEY!;

// Analizeaza viteza unui site cu Google PageSpeed Insights
// si actualizeaza leadul in DB. Rulezi asta DOAR pentru leadurile
// care au site si pe care vrei sa le suni (are limita zilnica gratuita).
export async function POST(req: NextRequest) {
  try {
    const { leadId, website } = await req.json();

    if (!website) {
      return NextResponse.json({ error: "Leadul nu are website" }, { status: 400 });
    }

    const url = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      website
    )}&key=${KEY}&strategy=mobile`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      // Site inaccesibil = oportunitate mare
      await supabaseAdmin
        .from("leads")
        .update({ scor_viteza: 0, site_vechi: true })
        .eq("id", leadId);
      return NextResponse.json({ scorViteza: 0, inaccesibil: true });
    }

    const scorViteza = Math.round(
      (data.lighthouseResult?.categories?.performance?.score || 0) * 100
    );
    const siteVechi = scorViteza < 50;

    await supabaseAdmin
      .from("leads")
      .update({ scor_viteza: scorViteza, site_vechi: siteVechi })
      .eq("id", leadId);

    return NextResponse.json({ scorViteza, siteVechi });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
