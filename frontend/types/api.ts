export interface SummaryResponse {
  dataset_name: string;
  rows: number;
  columns: number;
  numeric_columns: string[];
  categorical_columns: string[];
  missing_values_total: number;
  duplicated_rows: number;
}

export interface MissingByColumnItem {
  column: string;
  missing: number;
}

export interface DataTypeItem {
  column: string;
  dtype: string;
}

export interface DataQualityResponse {
  missing_values_by_column: MissingByColumnItem[];
  duplicated_rows: number;
  data_types: DataTypeItem[];
  columns: string[];
}

export interface StatItem {
  variable: string;
  mean: number;
  median: number;
  min: number;
  max: number;
  std: number;
}

export interface DescriptiveStatsResponse {
  stats: StatItem[];
}

export interface CorrelationItem {
  x: string;
  y: string;
  value: number;
}

export interface CorrelationsResponse {
  correlations: CorrelationItem[];
}

export interface OutlierItem {
  variable: string;
  q1: number;
  q3: number;
  iqr: number;
  lower_bound: number;
  upper_bound: number;
  outlier_count: number;
}

export interface OutliersResponse {
  outliers: OutlierItem[];
}

export interface DistributionItem {
  range: string;
  count: number;
}

export interface DistributionResponse {
  variable?: string;
  distributions: DistributionItem[];
}

export interface CategorySummaryItem {
  [key: string]: string | number;
}

export interface CategorySummaryResponse {
  category: string | null;
  metric?: string;
  summary: CategorySummaryItem[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}
