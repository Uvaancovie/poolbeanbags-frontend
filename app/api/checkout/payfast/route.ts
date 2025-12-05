import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://pool-drizzle-express.onrender.com";

// Retry fetch with exponential backoff for Render cold starts
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(30000), // 30 second timeout for cold starts
      });
      return response;
    } catch (error: any) {
      lastError = error;
      console.log(`[PAYFAST PROXY] Attempt ${i + 1} failed:`, error.message);
      
      // Wait before retry (exponential backoff: 1s, 2s, 4s)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError || new Error("Failed after retries");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("[PAYFAST PROXY] Forwarding request to backend...");

    // Forward request to backend with retry
    const response = await fetchWithRetry(`${API_BASE}/api/payfast/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log("[PAYFAST PROXY] Backend response:", { success: data.success, status: response.status });

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[PAYFAST PROXY ERROR]", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Payment service temporarily unavailable. Please try again in a moment." 
      },
      { status: 503 }
    );
  }
}
