import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";
import { getLanguageStats } from "../utils/languageUtils";

export default function LanguageChart({ repos }) {
  const data = getLanguageStats(repos);

  if (!data.length)
    return (
      <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>
        No language data available.
      </p>
    );

  return (
    <>
      <h3>Language Usage</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={5}
            stroke="none"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
}
