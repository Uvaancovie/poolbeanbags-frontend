import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || "https://pool-drizzle-express.onrender.com";
    const url = `${apiBase}/api/ozow/create`;
    
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    
    const data = await r.json();
    
    if (!r.ok) {
      console.error("Ozow create failed:", data);
      return NextResponse.json(data, { status: r.status });
    }
    
    return NextResponse.json(data, { status: 200 });
  } catch (e: any) {
    console.error("Ozow proxy error:", e);
    return NextResponse.json({ error: "PROXY_ERROR", detail: e?.message }, { status: 500 });
  }
}
