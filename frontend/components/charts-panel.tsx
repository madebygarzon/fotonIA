"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { CategorySummaryResponse, CorrelationsResponse, DistributionResponse, StatItem } from "@/types/api";

interface ChartsPanelProps {
  distribution: DistributionResponse;
  categorySummary: CategorySummaryResponse;
  stats: StatItem[];
  correlations: CorrelationsResponse;
}

const palette = ["#136f63", "#f2a65a", "#1a2232", "#7c8ea3", "#4a9f8f", "#d88637"];

export function ChartsPanel({ distribution, categorySummary, stats, correlations }: ChartsPanelProps) {
  const categoryData = categorySummary.summary;

  const lineData = categoryData
    .filter((row) => typeof row.month === "string")
    .map((row) => ({
      month: String(row.month),
      value: Number(row.average_value ?? row.count ?? 0)
    }));

  const costData = stats
    .filter((stat) => stat.variable.includes("cost"))
    .map((stat) => ({ variable: stat.variable, mean: stat.mean }));

  const corrData = correlations.correlations
    .filter((item) => item.x === item.y || Math.abs(item.value) > 0.35)
    .slice(0, 12)
    .map((item) => ({ pair: `${item.x} · ${item.y}`, value: Number(item.value.toFixed(2)) }));

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <article className="card p-4">
        <h3 className="text-lg font-semibold">Distribución: {distribution.variable ?? "N/A"}</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution.distributions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#136f63" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold">Promedio por categoría</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categorySummary.category ?? "category"} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={categorySummary.metric === "count" ? "count" : "average_value"}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold">Evolución por mes</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData.length > 0 ? lineData : [{ month: "N/A", value: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1a2232" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold">Correlaciones destacadas</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={corrData.length > 0 ? corrData : [{ pair: "N/A", value: 0 }]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[-1, 1]} />
              <YAxis type="category" dataKey="pair" width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="#f2a65a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
