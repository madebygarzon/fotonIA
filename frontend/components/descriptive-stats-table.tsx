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
      <h2 className="panel-title">Estadísticas descriptivas</h2>
      <div className="table-shell mt-4">
        <table className="table-core">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Media</th>
              <th>Mediana</th>
              <th>Mínimo</th>
              <th>Máximo</th>
              <th>Desviación estándar</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.variable}>
                <td className="font-medium">{row.variable}</td>
                <td>{fmt(row.mean)}</td>
                <td>{fmt(row.median)}</td>
                <td>{fmt(row.min)}</td>
                <td>{fmt(row.max)}</td>
                <td>{fmt(row.std)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
