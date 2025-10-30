export const runtime = "nodejs"
export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"

// Use an explicit upstream env var. In Vercel set UPSTREAM_CHECKOUT_URL to
// `https://pool-drizzle-express.onrender.com/api/checkout` (or create-order path)
const UPSTREAM = process.env.UPSTREAM_CHECKOUT_URL ?? "https://pool-drizzle-express.onrender.com/api/checkout"

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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Vary": "Origin",
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Proxy the request to upstream; no-store prevents caching and helps with debugging
    const upstreamRes = await fetch(UPSTREAM, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    const text = await upstreamRes.text()

    if (!upstreamRes.ok) {
      // Bubble upstream status and a truncated body to aid debugging in Vercel logs
      const truncated = text ? (text.length > 1000 ? text.slice(0, 1000) + '…' : text) : null
      return NextResponse.json(
        { error: "UPSTREAM_FAILED", status: upstreamRes.status, upstream: UPSTREAM, body: truncated },
        { status: 502, headers: corsHeaders() },
      )
    }

    // upstream OK → try parse JSON
    try {
      const json = JSON.parse(text)
      return NextResponse.json(json, { status: 200, headers: { ...corsHeaders(), "Cache-Control": "no-store" } })
    } catch (err) {
      // Upstream returned non-JSON (HTML/error page). Return as text for diagnositics
      const truncated = text ? (text.length > 2000 ? text.slice(0, 2000) + '…' : text) : ''
      return NextResponse.json(
        { error: "UPSTREAM_NON_JSON", upstream: UPSTREAM, body: truncated },
        { status: 502, headers: corsHeaders() },
      )
    }
  } catch (err: any) {
    return NextResponse.json({ error: "BAD_REQUEST", detail: err?.message }, { status: 400, headers: corsHeaders() })
  }
}
