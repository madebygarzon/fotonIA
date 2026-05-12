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

const chartStyles = {
  grid: "rgba(100,116,139,0.2)",
  axis: "#475569",
  tooltipBg: "rgba(248,250,252,0.96)",
  tooltipBorder: "rgba(148,163,184,0.45)"
};

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
        <h3 className="text-lg font-semibold text-slate-800">Distribución: {distribution.variable ?? "N/A"}</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution.distributions}>
              <CartesianGrid strokeDasharray="4 4" stroke={chartStyles.grid} />
              <XAxis dataKey="range" stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <YAxis stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(19,111,99,0.08)" }}
                contentStyle={{ borderRadius: 12, borderColor: chartStyles.tooltipBorder, background: chartStyles.tooltipBg }}
              />
              <Bar dataKey="count" fill="#136f63" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold text-slate-800">Promedio por categoría</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="4 4" stroke={chartStyles.grid} />
              <XAxis dataKey={categorySummary.category ?? "category"} stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <YAxis stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.06)" }}
                contentStyle={{ borderRadius: 12, borderColor: chartStyles.tooltipBorder, background: chartStyles.tooltipBg }}
              />
              <Bar dataKey={categorySummary.metric === "count" ? "count" : "average_value"} radius={[8, 8, 0, 0]}>
                {categoryData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold text-slate-800">Evolución por mes</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData.length > 0 ? lineData : [{ month: "N/A", value: 0 }]}>
              <CartesianGrid strokeDasharray="4 4" stroke={chartStyles.grid} />
              <XAxis dataKey="month" stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <YAxis stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ stroke: "rgba(15,23,42,0.2)", strokeWidth: 1 }}
                contentStyle={{ borderRadius: 12, borderColor: chartStyles.tooltipBorder, background: chartStyles.tooltipBg }}
              />
              <Line type="monotone" dataKey="value" stroke="#1a2232" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4">
        <h3 className="text-lg font-semibold text-slate-800">Correlaciones destacadas</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={corrData.length > 0 ? corrData : [{ pair: "N/A", value: 0 }]} layout="vertical">
              <CartesianGrid strokeDasharray="4 4" stroke={chartStyles.grid} />
              <XAxis type="number" domain={[-1, 1]} stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="pair" width={150} stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(242,166,90,0.12)" }}
                contentStyle={{ borderRadius: 12, borderColor: chartStyles.tooltipBorder, background: chartStyles.tooltipBg }}
              />
              <Bar dataKey="value" fill="#f2a65a" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="card p-4 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800">Costos promedio por variable</h3>
        <div className="h-64 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costData.length > 0 ? costData : [{ variable: "N/A", mean: 0 }]}>
              <CartesianGrid strokeDasharray="4 4" stroke={chartStyles.grid} />
              <XAxis dataKey="variable" stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <YAxis stroke={chartStyles.axis} tick={{ fontSize: 11 }} />
              <Tooltip
                cursor={{ fill: "rgba(71,85,105,0.08)" }}
                contentStyle={{ borderRadius: 12, borderColor: chartStyles.tooltipBorder, background: chartStyles.tooltipBg }}
              />
              <Bar dataKey="mean" fill="#334155" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  );
}
