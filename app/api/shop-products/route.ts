import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("GET /api/products hit");
  try {
    const RENDER_API = process.env.NEXT_PUBLIC_API_BASE || "https://pool-drizzle-express.onrender.com";
    
    const r = await fetch(`${RENDER_API}/api/products`, {
      headers: { "Accept": "application/json" },
      cache: 'no-store'
    });

    if (!r.ok) {
      return NextResponse.json({ products: [] }, { status: 200 });
    }

    const data = await r.json();
    const products = Array.isArray(data) ? data : data.products;
    return NextResponse.json({ products }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ products: [] }, { status: 200 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, OPTIONS",
    },
  });
}
