import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { calculScor } from "@/lib/scoring";

const KEY = process.env.GOOGLE_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { nisa, judet, oras } = await req.json();
    const zona = oras || judet;
    const textQuery = `${nisa} in ${zona}, Romania`;

    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.nationalPhoneNumber,places.location",
        },
        body: JSON.stringify({
          textQuery,
          languageCode: "ro",
          regionCode: "RO",
          maxResultCount: 20,
        }),
      }
    );

    const data = await searchRes.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Eroare Google API" },
        { status: 400 }
      );
    }

    const leads = (data.places || []).map((p: any) => {
      const areWebsite = !!p.websiteUri;
      const rating = p.rating || 0;
      const reviews = p.userRatingCount || 0;
      return {
        nume: p.displayName?.text || "Fara nume",
        telefon: p.nationalPhoneNumber || null,
        website: p.websiteUri || null,
        are_website: areWebsite,
        adresa: p.formattedAddress || null,
        judet,
        oras: zona,
        nisa,
        rating,
        nr_reviews: reviews,
        google_place_id: p.id,
        lat: p.location?.latitude || null,
        lng: p.location?.longitude || null,
        scor: calculScor({ areWebsite, rating, reviews }),
        status: "Nou",
      };
    });

    const { data: saved, error } = await supabaseAdmin
      .from("leads")
      .upsert(leads, { onConflict: "google_place_id", ignoreDuplicates: true })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch DB ids for all returned leads (new + existing)
    const placeIds = leads.map((l: any) => l.google_place_id);
    const { data: dbLeads } = await supabaseAdmin
      .from("leads")
      .select("id, google_place_id, scor_viteza")
      .in("google_place_id", placeIds);

    const idMap: Record<string, { id: string; scor_viteza: number | null }> = {};
    (dbLeads || []).forEach((r: any) => {
      idMap[r.google_place_id] = { id: r.id, scor_viteza: r.scor_viteza };
    });

    const leadsWithIds = leads.map((l: any) => ({
      ...l,
      id: idMap[l.google_place_id]?.id || null,
      scor_viteza: idMap[l.google_place_id]?.scor_viteza ?? null,
    }));

    leadsWithIds.sort((a: any, b: any) => b.scor - a.scor);
    return NextResponse.json({ leads: leadsWithIds, salvate: saved?.length || 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
