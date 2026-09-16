import { Utensils } from "lucide-react";

import {
  formatNumber,
  formatSignedNumber,
  getDateKey,
  getLastSevenDays,
  getWeightMeasurements,
} from "@/utils/memberDashboard";

export function WeightChart({ measurements }) {
  const values = getWeightMeasurements(measurements).slice(-12);
  const numbers = values.map((item) => Number(item.weight_kg));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const padding = Math.max((max - min) * 0.25, 0.8);
  const chartMin = min - padding;
  const chartMax = max + padding;
  const points = values
    .map((item, index) => {
      const x = 4 + (index / Math.max(values.length - 1, 1)) * 92;
      const y =
        90 - ((Number(item.weight_kg) - chartMin) / (chartMax - chartMin)) * 78;
      return `${x},${y}`;
    })
    .join(" ");
  const change = Number(values.at(-1).weight_kg) - Number(values[0].weight_kg);
  return (
    <div className="mt-5">
      <div className="mb-2 flex justify-end">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${change <= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-orange-500/15 text-orange-300"}`}
        >
          {formatSignedNumber(change)} kg
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-48 w-full overflow-visible"
        role="img"
        aria-label="Weight progress line chart"
      >
        <defs>
          <linearGradient id="weight-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[12, 32, 52, 72, 92].map((y) => (
          <line
            key={y}
            x1="4"
            x2="96"
            y1={y}
            y2={y}
            stroke="#8b5cf6"
            strokeOpacity="0.13"
            strokeDasharray="1 2"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <polygon points={`4,90 ${points} 96,90`} fill="url(#weight-fill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="mt-1 flex justify-between gap-2 text-[11px] text-slate-500">
        <span>{getDateKey(values[0].measured_on)}</span>
        <span>{getDateKey(values.at(-1).measured_on)}</span>
      </div>
    </div>
  );
}


export function ProgressRing({ progress }) {
  return (
    <div
      className="mx-auto mt-7 grid size-40 place-items-center rounded-full"
      style={{
        background: `conic-gradient(#8b5cf6 ${progress}%, rgba(139, 92, 246, .15) ${progress}% 100%)`,
      }}
    >
      <div className="grid size-[124px] place-items-center rounded-full bg-[#100d1d]">
        <div>
          <strong className="block text-4xl font-semibold text-violet-400">
            {progress}%
          </strong>
          <span className="text-xs text-slate-500">goal</span>
        </div>
      </div>
    </div>
  );
}


export function CaloriesChart({ logs, target }) {
  const days = getLastSevenDays();
  const values = days.map((day) =>
    Number(
      logs.find((item) => getDateKey(item.logged_on) === day.key)?.calories ||
        0,
    ),
  );
  const max = Math.max(...values, Number(target) || 0, 100);
  if (!values.some(Boolean))
    return (
      <ChartEmptyState
        icon={Utensils}
        text="Add daily nutrition logs to see your weekly calories."
      />
    );
  return (
    <div className="mt-7">
      <div className="flex h-44 items-end gap-2 border-b border-violet-500/15 px-1">
        {values.map((value, index) => (
          <div key={days[index].key} className="flex h-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-violet-500/85 transition hover:bg-violet-400"
              style={{
                height: `${Math.max((value / max) * 100, value ? 5 : 0)}%`,
              }}
              title={`${days[index].label}: ${value} kcal`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[11px] text-slate-500">
        {days.map((day) => (
          <span key={day.key}>{day.label}</span>
        ))}
      </div>
      {target && (
        <p className="mt-4 text-xs text-slate-500">
          Daily target:{" "}
          <span className="text-violet-300">{formatNumber(target)} kcal</span>
        </p>
      )}
    </div>
  );
}


export function ChartEmptyState({ icon: Icon, text }) {
  return (
    <div className="grid min-h-52 place-items-center text-center">
      <div>
        <span className="mx-auto grid size-11 place-items-center rounded-xl bg-violet-500/10 text-violet-400">
          <Icon size={20} />
        </span>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}
