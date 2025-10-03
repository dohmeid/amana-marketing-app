import { MarketingData, ApiResponse } from '../types/marketing';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiResponse = await response.json();
    throw new ApiError(response.status, error.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchMarketingData(): Promise<MarketingData> {
  try {
    const url = `${BASE_URL}/api/marketing-data`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    return handleResponse<MarketingData>(response);
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    throw error instanceof ApiError ? error : new Error('Failed to fetch marketing data');
  }
}