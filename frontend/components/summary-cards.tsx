import { SummaryResponse } from "@/types/api";

interface SummaryCardsProps {
  summary: SummaryResponse;
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    { title: "Total de registros", value: summary.rows },
    { title: "Total de columnas", value: summary.columns },
    { title: "Valores faltantes", value: summary.missing_values_total },
    { title: "Filas duplicadas", value: summary.duplicated_rows }
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <article key={card.title} className="card p-4">
          <p className="text-sm text-slate-500">{card.title}</p>
          <p className="mt-2 text-3xl font-semibold text-accent">{card.value}</p>
        </article>
      ))}
    </section>
  );
}
