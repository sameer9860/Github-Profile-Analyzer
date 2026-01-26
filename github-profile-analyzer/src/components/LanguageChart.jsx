import { PieChart, Pie, Tooltip } from "recharts";
import { getLanguageStats } from "../utils/dataTransformers";

export default function LanguageChart({ repos }) {
  const data = getLanguageStats(repos);

  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" nameKey="name" />
      <Tooltip />
    </PieChart>
  );
}
