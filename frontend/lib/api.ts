import {
  CategorySummaryResponse,
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
  getCategorySummary: () => fetchJson<CategorySummaryResponse>("/api/charts/category-summary")
};
