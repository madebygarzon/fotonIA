import {
  CategorySummaryResponse,
  ChatResponse,
  CorrelationsResponse,
  DataQualityResponse,
  DescriptiveStatsResponse,
  DistributionResponse,
  OutliersResponse,
  SummaryResponse
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getSummary: () => fetchJson<SummaryResponse>("/api/summary"),
  getDataQuality: () => fetchJson<DataQualityResponse>("/api/data-quality"),
  getDescriptiveStats: () => fetchJson<DescriptiveStatsResponse>("/api/descriptive-stats"),
  getCorrelations: () => fetchJson<CorrelationsResponse>("/api/correlations"),
  getOutliers: () => fetchJson<OutliersResponse>("/api/outliers"),
  getDistribution: () => fetchJson<DistributionResponse>("/api/charts/distribution"),
  getCategorySummary: () => fetchJson<CategorySummaryResponse>("/api/charts/category-summary"),
  uploadDataset: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json() as Promise<{ message: string; rows: number; columns: number }>;
  },
  askChat: async (question: string) => {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error(`Chat request failed: ${response.status}`);
    }

    return response.json() as Promise<ChatResponse>;
  },
};
