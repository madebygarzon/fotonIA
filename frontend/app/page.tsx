"use client";

import { useEffect, useState } from "react";
import { ChartsPanel } from "@/components/charts-panel";
import { DataQualityTable } from "@/components/data-quality-table";
import { DescriptiveStatsTable } from "@/components/descriptive-stats-table";
import { OutliersTable } from "@/components/outliers-table";
import { SummaryCards } from "@/components/summary-cards";
import { api } from "@/lib/api";
import {
  CategorySummaryResponse,
  CorrelationsResponse,
  DataQualityResponse,
  DescriptiveStatsResponse,
  DistributionResponse,
  OutliersResponse,
  SummaryResponse
} from "@/types/api";

interface DashboardData {
  summary: SummaryResponse;
  quality: DataQualityResponse;
  stats: DescriptiveStatsResponse;
  correlations: CorrelationsResponse;
  outliers: OutliersResponse;
  distribution: DistributionResponse;
  categorySummary: CategorySummaryResponse;
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const summary = await api.getSummary();
        const quality = await api.getDataQuality();
        const stats = await api.getDescriptiveStats();
        const correlations = await api.getCorrelations();
        const outliers = await api.getOutliers();

        let distribution: DistributionResponse = { variable: "N/A", distributions: [] };
        let categorySummary: CategorySummaryResponse = { category: null, summary: [] };

        try {
          distribution = await api.getDistribution();
        } catch {
          distribution = { variable: "N/A", distributions: [] };
        }

        try {
          categorySummary = await api.getCategorySummary();
        } catch {
          categorySummary = { category: null, summary: [] };
        }

        setData({
          summary,
          quality,
          stats,
          correlations,
          outliers,
          distribution,
          categorySummary
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error while loading dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-base via-white to-base px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="card p-6">
          <h1 className="text-3xl font-bold">fotonIA Analytics</h1>
          <p className="mt-2 text-slate-600">Análisis exploratorio de datos energéticos</p>
        </header>

        {loading && <p className="card p-4">Cargando datos del backend...</p>}
        {error && <p className="card p-4 text-red-700">Error: {error}</p>}

        {!loading && !error && data && (
          <>
            <SummaryCards summary={data.summary} />
            <DataQualityTable quality={data.quality} />
            <DescriptiveStatsTable stats={data.stats.stats} />
            <ChartsPanel
              distribution={data.distribution}
              categorySummary={data.categorySummary}
              stats={data.stats.stats}
              correlations={data.correlations}
            />
            <OutliersTable outliers={data.outliers.outliers} />

            <section className="card p-4">
              <h2 className="text-xl font-semibold">Hallazgos preliminares</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-sm text-slate-700">
                <li>Patrones observados: variaciones de costos entre regiones y meses.</li>
                <li>Posibles anomalías: picos de consumo en ciertos segmentos temporales o geográficos.</li>
                <li>Recomendaciones iniciales: validar calidad de fuente y ampliar histórico temporal.</li>
              </ul>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
