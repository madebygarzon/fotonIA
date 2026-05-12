import { StatItem } from "@/types/api";

interface DescriptiveStatsTableProps {
  stats: StatItem[];
}

function fmt(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : "-";
}

export function DescriptiveStatsTable({ stats }: DescriptiveStatsTableProps) {
  return (
    <section className="card p-4">
      <h2 className="text-xl font-semibold">Estadísticas descriptivas</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="pb-2">Variable</th>
              <th className="pb-2">Media</th>
              <th className="pb-2">Mediana</th>
              <th className="pb-2">Mínimo</th>
              <th className="pb-2">Máximo</th>
              <th className="pb-2">Desviación estándar</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.variable} className="border-b border-slate-100">
                <td className="py-2">{row.variable}</td>
                <td className="py-2">{fmt(row.mean)}</td>
                <td className="py-2">{fmt(row.median)}</td>
                <td className="py-2">{fmt(row.min)}</td>
                <td className="py-2">{fmt(row.max)}</td>
                <td className="py-2">{fmt(row.std)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
