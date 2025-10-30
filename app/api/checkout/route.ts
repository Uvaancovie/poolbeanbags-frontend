import { NextResponse } from "next/server"

const UPSTREAM = process.env.UPSTREAM_CHECKOUT_URL
  ?? "https://pool-drizzle-express.onrender.com/api/checkout"

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    },
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const upstream = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const text = await upstream.text()
    if (!upstream.ok) {
      // upstream error: forward content
      let detail = text
      try { detail = JSON.parse(text) } catch {}
      return NextResponse.json({ error: "Upstream failed", detail }, { status: 502 })
    }

    // upstream ok: parse json if possible
    try {
      const data = JSON.parse(text)
      return NextResponse.json(data, { status: 200, headers: { "Cache-Control": "no-store" } })
    } catch {
      // not JSON, return raw text
      return new NextResponse(text, { status: 200, headers: { "Content-Type": "text/plain" } })
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Bad request", detail: err?.message }, { status: 400 })
  }
}
