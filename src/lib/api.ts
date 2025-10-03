import { MarketingData } from "../types/marketing";

// Function to get the correct base URL for API calls
function getApiBaseUrl(): string {

  // On the server, we need an absolute URL --- On the client, a relative path is sufficient
  if (typeof window === "undefined") {
    // Use the VERCEL_URL in production or localhost for development.
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  }

  // For client-side fetching.
  return "";
}

/**
 * Fetches marketing data from the server-side.
 * This is ideal for Server Components, getStaticProps, or getServerSideProps.
 */
export async function fetchMarketingData(): Promise<MarketingData> {
  try {
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}/api/marketing-data`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", //// Disable caching for development
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as MarketingData;
  } catch (error) {
    console.error("Error fetching marketing data on the server:", error);
    throw new Error(
      `Failed to fetch marketing data: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Fetches marketing data from the client-side.
 * This is for use in client components, e.g., inside a useEffect hook.
*/
export async function fetchMarketingDataClient(): Promise<MarketingData> {
  try {
    const response = await fetch("/api/marketing-data");

    if (!response.ok) {
      // Try to parse error JSON, but fallback to status text if it fails.
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as MarketingData;
  } catch (error) {
    console.error("Error fetching marketing data on the client:", error);
    throw error;
  }
}
