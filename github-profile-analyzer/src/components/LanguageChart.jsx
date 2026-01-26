import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getLanguageStats } from "../utils/languageUtils";

export default function LanguageChart({ repos }) {
  const data = getLanguageStats(repos);

  if (!data.length) return <p>No language data available.</p>;

  return (
    <div className="chart-card">
      <h3>Language Usage</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
