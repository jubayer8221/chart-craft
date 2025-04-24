import { ChartData } from "@/types/chartTypes";

export default function EditableChartTable({
  data,
  onDataChange,
}: {
  data: ChartData;
  onDataChange: (newData: ChartData) => void;
}) {
  const updateValue = (
    datasetIndex: number,
    dataIndex: number,
    value: number
  ) => {
    const updated = { ...data };
    updated.datasets[datasetIndex].data[dataIndex] = value;
    onDataChange(updated);
  };

  return (
    <table className="table-auto w-full text-sm border mt-2">
      <thead>
        <tr>
          <th className="p-1 border">Label</th>
          {data.labels.map((label, i) => (
            <th key={i} className="p-1 border">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.datasets.map((dataset, dsIndex) => (
          <tr key={dsIndex}>
            <td className="p-1 border">{dataset.label}</td>
            {dataset.data.map((value, dIndex) => (
              <td key={dIndex} className="p-1 border">
                <input
                  type="number"
                  className="w-16 border p-1"
                  value={value}
                  onChange={(e) =>
                    updateValue(dsIndex, dIndex, +e.target.value)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
