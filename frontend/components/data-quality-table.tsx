import { DataQualityResponse } from "@/types/api";

interface DataQualityTableProps {
  quality: DataQualityResponse;
}

export function DataQualityTable({ quality }: DataQualityTableProps) {
  const missingMap = new Map(quality.missing_values_by_column.map((item) => [item.column, item.missing]));

  return (
    <section className="card p-4">
      <h2 className="panel-title">Calidad de datos</h2>
      <div className="table-shell mt-4">
        <table className="table-core">
          <thead>
            <tr>
              <th>Columna</th>
              <th>Tipo</th>
              <th>Valores faltantes</th>
            </tr>
          </thead>
          <tbody>
            {quality.data_types.map((item) => (
              <tr key={item.column}>
                <td className="font-medium">{item.column}</td>
                <td>{item.dtype}</td>
                <td>{missingMap.get(item.column) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
