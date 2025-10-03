import { NextResponse } from "next/server";
import { headers } from 'next/headers';
import { MarketingData } from "@/src/types/marketing";

const API_URL = process.env.API_URL!;

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET() {
  try {
    // Get request headers
    const headersList = headers();

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 } // Revalidate data every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarketingData = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": "s-maxage=60, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching marketing data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch marketing data",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}