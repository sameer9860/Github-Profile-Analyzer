export default function ScoreBadge({ score }) {
  let level = "Beginner";
  let color = "#8b949e";

  if (score > 500) {
    level = "Pro";
    color = "#2ea043";
  } else if (score > 200) {
    level = "Intermediate";
    color = "#58a6ff";
  }

  return (
    <div className="score-badge" style={{ borderColor: color }}>
      <h3 style={{ color }}>{score}</h3>
      <p>{level} Developer</p>
    </div>
  );
}
