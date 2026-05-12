import { DataQualityResponse } from "@/types/api";

interface DataQualityTableProps {
  quality: DataQualityResponse;
}

export function DataQualityTable({ quality }: DataQualityTableProps) {
  const missingMap = new Map(quality.missing_values_by_column.map((item) => [item.column, item.missing]));

  return (
    <section className="card p-4">
      <h2 className="text-xl font-semibold">Calidad de datos</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="pb-2">Columna</th>
              <th className="pb-2">Tipo</th>
              <th className="pb-2">Valores faltantes</th>
            </tr>
          </thead>
          <tbody>
            {quality.data_types.map((item) => (
              <tr key={item.column} className="border-b border-slate-100">
                <td className="py-2">{item.column}</td>
                <td className="py-2">{item.dtype}</td>
                <td className="py-2">{missingMap.get(item.column) ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
