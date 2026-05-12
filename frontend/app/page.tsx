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

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

export default function HomePage() {
  const sampleCsvUrl = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/sample-csv`;
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInfoHovered, setIsInfoHovered] = useState(false);
  const [isInfoPinnedOpen, setIsInfoPinnedOpen] = useState(true);
  const [isInfoDismissed, setIsInfoDismissed] = useState(false);

  async function loadDashboardData() {
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

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInfoPinnedOpen(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get("dataset") as File | null;

    if (!file || file.size === 0) {
      setUploadMessage("Selecciona un archivo CSV válido.");
      return;
    }

    try {
      setUploading(true);
      setUploadMessage(null);
      const result = await api.uploadDataset(file);
      setUploadMessage(`${result.message} Filas: ${result.rows}, columnas: ${result.columns}.`);
      await loadDashboardData();
    } catch (err) {
      setUploadMessage(err instanceof Error ? err.message : "Error al subir dataset.");
    } finally {
      setUploading(false);
      event.currentTarget.reset();
    }
  }

  async function handleChatSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = chatQuestion.trim();
    if (!question) {
      return;
    }

    setChatLoading(true);
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setChatQuestion("");

    try {
      const response = await api.askChat(question);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.answer, sources: response.sources },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: err instanceof Error ? err.message : "Error al consultar el chat.",
          sources: [],
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-28 w-28 -translate-y-8 translate-x-8 rounded-full bg-emerald-100/60" />
          <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-8 translate-y-8 rounded-full bg-amber-100/60" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">fotonIA</p>
          <h1 className="relative mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">fotonIA Analytics</h1>
          <p className="relative mt-2 max-w-2xl text-slate-600">Análisis exploratorio de datos energéticos con enfoque académico.</p>
        </header>

        <section className="card p-5">
          <h2 className="panel-title">Cargar dataset CSV</h2>
          <p className="mt-1 text-sm text-slate-600">
            Sube un archivo CSV para actualizar el análisis.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Columnas esperadas: <span className="font-medium">region, month, generation_cost, distribution_cost, commercialization_cost, unit_cost, energy_consumption_kwh</span>.
          </p>
          <div className="mt-3">
            <a
              href={sampleCsvUrl}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Descargar CSV de ejemplo
            </a>
          </div>
          <form onSubmit={handleUpload} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="file"
              name="dataset"
              accept=".csv,text/csv"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={uploading}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 disabled:opacity-60"
            >
              {uploading ? "Subiendo..." : "Subir archivo"}
            </button>
          </form>
          {uploadMessage && <p className="mt-3 text-sm text-slate-700">{uploadMessage}</p>}
        </section>

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

      <button
        type="button"
        onClick={() => setIsChatOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-40 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5"
      >
        {isChatOpen ? "Cerrar chat" : "Abrir chat"}
      </button>

      <div
        className="fixed right-6 top-6 z-40"
        onMouseEnter={() => setIsInfoHovered(true)}
        onMouseLeave={() => setIsInfoHovered(false)}
      >
        <button
          type="button"
          onClick={() => {
            if (isInfoPinnedOpen) {
              setIsInfoPinnedOpen(false);
              setIsInfoDismissed(true);
            }
          }}
          className={`flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-ink shadow-[0_18px_40px_-18px_rgba(15,23,42,0.5)] transition ${
            !isInfoDismissed ? "animate-bounce" : ""
          }`}
          aria-label="Información de la plataforma"
        >
          i
        </button>
        <div
          className={`absolute right-0 top-14 w-80 rounded-xl border border-slate-200 bg-white p-3 text-[17px] text-slate-700 shadow-xl transition-all duration-200 ${
            isInfoPinnedOpen || isInfoHovered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          <div className="mb-1 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setIsInfoPinnedOpen(false);
                setIsInfoDismissed(true);
              }}
              className="rounded-md px-1 text-base leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Cerrar información"
            >
              ×
            </button>
          </div>
          fotonIA Analytics te ayuda a entender tus datos energéticos de forma rápida: resume calidad de datos, muestra estadísticas, detecta outliers y genera gráficas para explorar patrones. También incluye un chat para hacer preguntas simples sobre el dataset cargado.
        </div>
      </div>

      {isChatOpen && (
        <section className="fixed bottom-24 right-6 z-40 flex h-[70vh] w-[92vw] max-w-md flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
          <header className="border-b border-slate-200 p-4">
            <h2 className="text-lg font-semibold">Chatbot fotonIA</h2>
            <p className="mt-1 text-xs text-slate-600">
              Pregunta sobre el dataset cargado (promedios, máximos, faltantes o filas relevantes).
            </p>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {chatMessages.length === 0 && (
              <p className="text-sm text-slate-500">Aún no hay mensajes. Haz tu primera pregunta.</p>
            )}
            {chatMessages.map((message, index) => (
              <article
                key={`${message.role}-${index}`}
                className={`rounded-md p-3 text-sm ${message.role === "user" ? "bg-slate-100" : "bg-emerald-50"}`}
              >
                <p className="font-semibold">{message.role === "user" ? "Tú" : "Asistente"}</p>
                <p className="mt-1">{message.text}</p>
                {message.sources && message.sources.length > 0 && (
                  <p className="mt-1 text-xs text-slate-600">Fuentes: {message.sources.join(", ")}</p>
                )}
              </article>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="flex gap-2 border-t border-slate-200 p-3">
            <input
              type="text"
              value={chatQuestion}
              onChange={(event) => setChatQuestion(event.target.value)}
              placeholder="Ejemplo: promedio de unit_cost"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {chatLoading ? "..." : "Enviar"}
            </button>
          </form>
        </section>
      )}

      <div className="fixed bottom-3 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 text-xs font-semibold tracking-[0.18em] text-slate-400/80">
        <span className="select-none">bygarzon</span>
        <a
          href="https://github.com/madebygarzon/fotonIA"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Repositorio de fotonIA en GitHub"
          className="text-slate-500 transition hover:text-slate-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M12 2C6.477 2 2 6.596 2 12.268c0 4.535 2.865 8.383 6.839 9.741.5.094.682-.223.682-.495 0-.244-.009-.891-.014-1.748-2.782.617-3.369-1.39-3.369-1.39-.455-1.183-1.11-1.498-1.11-1.498-.908-.636.069-.623.069-.623 1.004.072 1.532 1.058 1.532 1.058.892 1.57 2.341 1.116 2.91.853.091-.667.349-1.116.635-1.373-2.22-.262-4.555-1.14-4.555-5.074 0-1.12.39-2.036 1.029-2.754-.103-.262-.446-1.318.098-2.748 0 0 .84-.275 2.75 1.052A9.36 9.36 0 0 1 12 6.871c.85.004 1.706.119 2.505.35 1.909-1.327 2.748-1.052 2.748-1.052.546 1.43.203 2.486.1 2.748.64.718 1.028 1.634 1.028 2.754 0 3.944-2.338 4.81-4.566 5.067.359.318.678.944.678 1.904 0 1.374-.012 2.482-.012 2.82 0 .274.18.594.688.493C19.138 20.647 22 16.801 22 12.268 22 6.596 17.523 2 12 2Z" />
          </svg>
        </a>
      </div>
    </main>
  );
}
