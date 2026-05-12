import { OutlierItem } from "@/types/api";

interface OutliersTableProps {
  outliers: OutlierItem[];
}

export function OutliersTable({ outliers }: OutliersTableProps) {
  return (
    <section className="card p-4">
      <h2 className="panel-title">Outliers detectados por IQR</h2>
      <div className="table-shell mt-4">
        <table className="table-core">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Límite inferior</th>
              <th>Límite superior</th>
              <th>Cantidad outliers</th>
            </tr>
          </thead>
          <tbody>
            {outliers.map((row) => (
              <tr key={row.variable}>
                <td className="font-medium">{row.variable}</td>
                <td>{row.lower_bound.toFixed(2)}</td>
                <td>{row.upper_bound.toFixed(2)}</td>
                <td className={row.outlier_count > 0 ? "font-semibold text-rose-700" : "font-medium text-emerald-700"}>
                  {row.outlier_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
