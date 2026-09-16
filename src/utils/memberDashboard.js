export function cleanNumbers(values) {
  const numeric = [
    "weight_kg",
    "body_fat_percent",
    "waist_cm",
    "calories",
    "protein_g",
    "carbs_g",
    "fat_g",
  ];
  const cleaned = {};

  for (const [key, value] of Object.entries(values)) {
    if (value === "") {
      cleaned[key] = null;
    } else if (numeric.includes(key)) {
      cleaned[key] = Number(value);
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

export function toDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(
    Number(value),
  );
}

export function formatSignedNumber(value) {
  return `${value > 0 ? "+" : ""}${formatNumber(value)}`;
}

export function getDateKey(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return toDateInput(date);
}

export function isCurrentMonth(value) {
  const date = new Date(`${getDateKey(value)}T00:00:00`);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export function getWeightMeasurements(measurements, newestFirst = false) {
  return measurements
    .filter((item) => item.weight_kg)
    .sort((a, b) => {
      const order = getDateKey(a.measured_on).localeCompare(getDateKey(b.measured_on));
      return newestFirst ? -order : order;
    });
}

export function getCurrentWeight(measurements, programWeight) {
  const latest = getWeightMeasurements(measurements, true)[0];
  return latest?.weight_kg || programWeight || null;
}

export function getWeightChange(measurements) {
  const values = getWeightMeasurements(measurements);
  return values.length > 1
    ? Number(values.at(-1).weight_kg) - Number(values[0].weight_kg)
    : null;
}

export function getAverageDuration(workouts) {
  const values = workouts
    .map((item) => Number(item.duration_minutes))
    .filter(Boolean);
  return values.length
    ? Math.round(
        values.reduce((total, value) => total + value, 0) / values.length,
      )
    : null;
}

export function getWeeklyCalories(logs) {
  const keys = new Set(getLastSevenDays().map((item) => item.key));
  const recent = logs.filter(
    (item) => keys.has(getDateKey(item.logged_on)) && item.calories !== null,
  );
  return {
    total: recent.reduce(
      (total, item) => total + Number(item.calories || 0),
      0,
    ),
    daysLogged: recent.length,
  };
}

export function getLastSevenDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 6 + index);
    return {
      key: toDateInput(date),
      label: new Intl.DateTimeFormat("en", { weekday: "short" })
        .format(date)
        .slice(0, 2),
    };
  });
}

export function getBestPersonalRecords(records) {
  const best = new Map();
  for (const record of records) {
    const key = `${record.exercise_name.toLowerCase()}-${record.unit}`;
    const current = best.get(key);
    if (!current || Number(record.value) > Number(current.value)) {
      best.set(key, { ...record, key });
    }
  }
  return [...best.values()].sort((a, b) =>
    b.achieved_on.localeCompare(a.achieved_on),
  );
}
