export default function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded ${className}`}
      style={style}
    />
  );
}
