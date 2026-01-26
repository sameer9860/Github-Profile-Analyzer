export default function ScoreBadge({ score }) {
  let level = "Beginner";
  let color = "#8b949e";

  if (score > 500) {
    level = "Expert";
    color = "var(--accent-green)";
  } else if (score > 200) {
    level = "Advanced";
    color = "var(--accent-blue)";
  }

  return (
    <div
      className="score-badge"
      style={{ borderColor: color, background: `${color}11` }}
    >
      <h3 style={{ color }}>{score}</h3>
      <p style={{ color }}>{level}</p>
    </div>
  );
}
