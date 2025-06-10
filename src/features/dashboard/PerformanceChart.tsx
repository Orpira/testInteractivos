import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PerformanceChartProps = {
  data: { category: string; average: number }[];
};

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-bold mb-4 text-center">
        Rendimiento por categoría
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          <Bar dataKey="average" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
