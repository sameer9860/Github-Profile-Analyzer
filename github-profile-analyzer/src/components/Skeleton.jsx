export default function Skeleton({ width = "100%", height = "20px", style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, ...style }}
    ></div>
  );
}
