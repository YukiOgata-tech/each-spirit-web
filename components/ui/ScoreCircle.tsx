const RADIUS = 38;
const STROKE = 7;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function scoreColor(score: number) {
  if (score >= 85) return { track: "#22c55e", glow: "rgba(34,197,94,0.25)" };
  if (score >= 70) return { track: "#f59e0b", glow: "rgba(245,158,11,0.25)" };
  return { track: "#ef4444", glow: "rgba(239,68,68,0.25)" };
}

export function ScoreCircle({ score, size = 96 }: { score: number; size?: number }) {
  const pct = Math.min(100, Math.max(0, score)) / 100;
  const offset = CIRCUMFERENCE * (1 - pct);
  const { track, glow } = scoreColor(score);
  const cx = (RADIUS + STROKE) * 2 / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${(RADIUS + STROKE) * 2} ${(RADIUS + STROKE) * 2}`}
        className="-rotate-90"
      >
        {/* glow filter */}
        <defs>
          <filter id={`glow-${score}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* background track */}
        <circle
          cx={cx}
          cy={cx}
          r={RADIUS}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={STROKE}
        />
        {/* progress arc */}
        <circle
          cx={cx}
          cy={cx}
          r={RADIUS}
          fill="none"
          stroke={track}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          filter={`url(#glow-${score})`}
          style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
        />
      </svg>
      {/* center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black leading-none tabular-nums" style={{ color: track }}>
          {score}
        </span>
        <span className="text-[10px] font-semibold text-slate-400">/ 100</span>
      </div>
    </div>
  );
}
