import { SummaryResponse } from "@/types/api";

interface SummaryCardsProps {
  summary: SummaryResponse;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { title: "Total de registros", value: summary.rows, tone: "text-teal-700" },
    { title: "Total de columnas", value: summary.columns, tone: "text-sky-700" },
    { title: "Valores faltantes", value: summary.missing_values_total, tone: "text-amber-700" },
    { title: "Filas duplicadas", value: summary.duplicated_rows, tone: "text-rose-700" }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article key={card.title} className="card relative overflow-hidden p-4">
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100/80" />
          <p className="relative text-xs font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
          <p className={`relative mt-2 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
        </article>
      ))}
    </section>
  );
}
