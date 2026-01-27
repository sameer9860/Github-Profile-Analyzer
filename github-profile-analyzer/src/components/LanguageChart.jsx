import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = [
  "#00C49F",
  "#0088FE",
  "#FFBB28",
  "#FF8042",
  "#A855F7",
  "#22C55E",
  "#EF4444",
  "#EAB308",
];

export default function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  const languageCount = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCount[repo.language] =
        (languageCount[repo.language] || 0) + 1;
    }
  });

  const data = Object.keys(languageCount).map((lang) => ({
    name: lang,
    value: languageCount[lang],
  }));

  return (
    <div className="chart-card">
      <h3>Most Used Languages</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}   // 👈 donut style (modern)
            paddingAngle={3}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
