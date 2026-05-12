import { OutlierItem } from "@/types/api";

interface OutliersTableProps {
  outliers: OutlierItem[];
}

export function OutliersTable({ outliers }: OutliersTableProps) {
  return (
    <section className="card p-4">
      <h2 className="text-xl font-semibold">Outliers detectados por IQR</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="pb-2">Variable</th>
              <th className="pb-2">Límite inferior</th>
              <th className="pb-2">Límite superior</th>
              <th className="pb-2">Cantidad outliers</th>
            </tr>
          </thead>
          <tbody>
            {outliers.map((row) => (
              <tr key={row.variable} className="border-b border-slate-100">
                <td className="py-2">{row.variable}</td>
                <td className="py-2">{row.lower_bound.toFixed(2)}</td>
                <td className="py-2">{row.upper_bound.toFixed(2)}</td>
                <td className="py-2">{row.outlier_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
