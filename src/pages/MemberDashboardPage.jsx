import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Plus,
  Sparkles,
  Trophy,
  Trash2,
  Utensils,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getApiErrorMessage } from "@/services/apiClient";
import {
  createMemberResource,
  deleteMemberResource,
  getMemberDashboardData,
  updateMemberResource,
} from "@/services/memberDashboardService";
import { getInitials } from "@/utils/utils";

const dashboardSections = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "weight", label: "Weight Progress", icon: Activity },
  { id: "workouts", label: "Workout Log", icon: Dumbbell },
  { id: "nutrition", label: "Nutrition", icon: Utensils },
  { id: "records", label: "Personal Records", icon: Trophy },
];

export function MemberDashboardPage() {
  const { currentUser } = useMemberAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(currentUser));
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const displayName = currentUser?.name || currentUser?.username || "Athlete";

  async function refreshDashboard() {
    setLoadError("");
    try {
      setDashboard(await getMemberDashboardData());
    } catch (error) {
      setLoadError(getApiErrorMessage(error));
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (!currentUser)
      return () => {
        isMounted = false;
      };

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const data = await getMemberDashboardData();
        if (isMounted) setDashboard(data);
      } catch (error) {
        if (isMounted) setLoadError(getApiErrorMessage(error));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  return (
    <PageShell>
      <main>
        <Container className="py-7 md:py-10">
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <DashboardSidebar
              user={currentUser}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
            <div className="min-w-0">
              {activeSection === "overview" && (
                <DashboardHeading displayName={displayName} />
              )}
              {isLoading ? (
                <LoadingState />
              ) : loadError ? (
                <ErrorState message={loadError} />
              ) : dashboard?.program ? (
                <DashboardContent
                  dashboard={dashboard}
                  activeSection={activeSection}
                  onRefresh={refreshDashboard}
                />
              ) : (
                <ProgramRequiredState />
              )}
            </div>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}

function DashboardHeading({ displayName }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="forge-kicker">Member dashboard</p>
        <h1 className="mt-3 text-3xl font-semibold uppercase text-white md:text-4xl">
          Hello, <span className="text-violet-400">{displayName}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Here&apos;s your fitness snapshot — keep pushing forward.
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-[#100d1d] px-4 py-2.5 text-sm text-slate-400">
        <CalendarDays size={16} className="text-violet-300" />
        {new Intl.DateTimeFormat("en", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date())}
      </div>
    </div>
  );
}

function DashboardSidebar({ user, activeSection, onSectionChange }) {
  const displayName = user.name || user.username || "Athlete";
  return (
    <aside className="forge-panel h-fit rounded-2xl p-4 lg:sticky lg:top-6">
      <div className="flex items-center gap-3 border-b border-violet-500/15 px-2 pb-5">
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-violet-600/25 text-sm font-semibold text-violet-300">
            {getInitials(displayName)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            {displayName}
          </p>
          <p className="mt-1 text-xs text-violet-400">JB Fit Member</p>
        </div>
      </div>
      <nav
        className="mt-4 grid grid-cols-2 gap-1 lg:grid-cols-1"
        aria-label="Dashboard sections"
      >
        {dashboardSections.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => onSectionChange(id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-xs transition sm:text-sm ${activeSection === id ? "bg-violet-600/20 text-violet-300" : "text-slate-500 hover:bg-white/5 hover:text-slate-200"}`}
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </button>
        ))}
      </nav>
      <Link
        to="/program"
        className="mt-5 flex items-center gap-3 rounded-xl border border-violet-500/20 px-3 py-3 text-sm text-slate-300 transition hover:bg-violet-500/10 hover:text-white"
      >
        <Zap size={17} className="text-violet-400" />
        New Program
      </Link>
    </aside>
  );
}

function DashboardContent({ dashboard, activeSection, onRefresh }) {
  if (activeSection === "weight")
    return (
      <WeightSection
        measurements={dashboard.measurements}
        onRefresh={onRefresh}
      />
    );
  if (activeSection === "workouts")
    return (
      <WorkoutSection
        program={dashboard.program}
        workouts={dashboard.workouts}
        onRefresh={onRefresh}
      />
    );
  if (activeSection === "nutrition")
    return (
      <NutritionSection
        program={dashboard.program}
        logs={dashboard.nutritionLogs}
        onRefresh={onRefresh}
      />
    );
  if (activeSection === "records")
    return (
      <RecordsSection
        records={dashboard.personalRecords}
        onRefresh={onRefresh}
      />
    );
  return <DashboardOverview dashboard={dashboard} />;
}

function DashboardOverview({ dashboard }) {
  const { program, workouts, measurements, nutritionLogs, personalRecords } =
    dashboard;
  const workoutDays = Number(program.days_per_week) || 4;
  const completedWorkouts = workouts.filter((item) => item.completed);
  const monthlyWorkouts = completedWorkouts.filter((item) =>
    isCurrentMonth(item.workout_date),
  );
  const monthGoal = workoutDays * 4;
  const monthlyProgress = Math.min(
    100,
    Math.round((monthlyWorkouts.length / monthGoal) * 100),
  );
  const currentWeight = getCurrentWeight(measurements, program.weight_kg);
  const weightChange = getWeightChange(measurements);
  const averageDuration = getAverageDuration(completedWorkouts);
  const weeklyCalories = getWeeklyCalories(nutritionLogs);
  const records = getBestPersonalRecords(personalRecords).slice(0, 4);

  return (
    <section className="mt-8 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotCard
          icon={Activity}
          tone="emerald"
          value={currentWeight ? `${formatNumber(currentWeight)} kg` : "—"}
          label="Current Weight"
          note={
            weightChange === null
              ? "Add a measurement to track change"
              : `${formatSignedNumber(weightChange)} kg since first log`
          }
        />
        <SnapshotCard
          icon={Dumbbell}
          tone="violet"
          value={monthlyWorkouts.length}
          label="Workouts This Month"
          note={`${Math.max(monthGoal - monthlyWorkouts.length, 0)} sessions to monthly goal`}
        />
        <SnapshotCard
          icon={Clock3}
          tone="blue"
          value={averageDuration ? `${averageDuration} min` : "—"}
          label="Avg Session Length"
          note={
            averageDuration
              ? "From completed workouts"
              : "Log workout durations to track"
          }
        />
        <SnapshotCard
          icon={Flame}
          tone="orange"
          value={
            weeklyCalories.total ? formatNumber(weeklyCalories.total) : "—"
          }
          label="Calories Logged (7d)"
          note={
            weeklyCalories.daysLogged
              ? `${formatNumber(Math.round(weeklyCalories.total / weeklyCalories.daysLogged))} kcal/day avg`
              : "Add nutrition logs to track"
          }
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.8fr_.86fr]">
        <Panel className="min-h-[310px]">
          <PanelTitle title="Weight Progress" meta="Last 12 measurements" />
          {measurements.filter((item) => item.weight_kg).length > 1 ? (
            <WeightChart measurements={measurements} />
          ) : (
            <ChartEmptyState
              icon={Activity}
              text="Add at least two weight measurements to see your progress chart."
            />
          )}
        </Panel>
        <Panel className="grid min-h-[310px] place-items-center text-center">
          <div className="w-full">
            <PanelTitle title="Monthly Goal" />
            <ProgressRing progress={monthlyProgress} />
            <p className="mt-5 text-sm text-slate-400">
              of monthly workout goal
            </p>
            <p className="mt-2 text-sm font-medium text-slate-200">
              {monthlyWorkouts.length} of {monthGoal} sessions done
            </p>
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelTitle title="Recent Workouts" action="View all" />
          <RecentWorkouts workouts={workouts} />
        </Panel>
        <Panel>
          <PanelTitle title="Weekly Calories" meta="Last 7 days" />
          <CaloriesChart
            logs={nutritionLogs}
            target={program.nutrition_plan?.daily_calories}
          />
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="Personal Records" action="View all" />
        {records.length ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {records.map((record) => (
              <RecordCard key={record.key} record={record} />
            ))}
          </div>
        ) : (
          <ChartEmptyState
            icon={Trophy}
            text="Add personal records to see your strongest lifts here."
          />
        )}
      </Panel>
    </section>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section className={`forge-panel rounded-2xl p-5 md:p-6 ${className}`}>
      {children}
    </section>
  );
}
function PanelTitle({ title, meta, action }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
        {meta && <p className="mt-1 text-xs text-slate-500">{meta}</p>}
      </div>
      {action && (
        <span className="inline-flex items-center gap-1 text-sm text-violet-400">
          {action}
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}

function SnapshotCard({ icon: Icon, tone, value, label, note }) {
  const tones = {
    emerald: "bg-emerald-500/15 text-emerald-400",
    violet: "bg-violet-500/15 text-violet-400",
    blue: "bg-blue-500/15 text-blue-400",
    orange: "bg-orange-500/15 text-orange-400",
  };
  return (
    <Panel>
      <span
        className={`grid size-11 place-items-center rounded-xl ${tones[tone]}`}
      >
        <Icon size={21} />
      </span>
      <strong className="mt-5 block font-mono text-2xl text-white">
        {value}
      </strong>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
      <p className="mt-2 text-xs text-violet-300">{note}</p>
    </Panel>
  );
}

function WeightChart({ measurements }) {
  const values = measurements
    .filter((item) => item.weight_kg)
    .sort((a, b) =>
      getDateKey(a.measured_on).localeCompare(getDateKey(b.measured_on)),
    )
    .slice(-12);
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
        <span>{formatShortDate(values[0].measured_on)}</span>
        <span>{formatShortDate(values.at(-1).measured_on)}</span>
      </div>
    </div>
  );
}

function ProgressRing({ progress }) {
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

function RecentWorkouts({ workouts }) {
  const recent = [...workouts]
    .sort((a, b) =>
      getDateKey(b.workout_date).localeCompare(getDateKey(a.workout_date)),
    )
    .slice(0, 4);
  if (!recent.length)
    return (
      <ChartEmptyState
        icon={Dumbbell}
        text="Your recently logged workouts will appear here."
      />
    );
  return (
    <div className="mt-5 space-y-3">
      {recent.map((workout) => (
        <div
          key={workout.id}
          className="flex items-center justify-between gap-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <WorkoutTypeBadge name={workout.session_name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {workout.session_name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {formatLongDate(workout.workout_date)}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm text-slate-300">
              {workout.duration_minutes ? `${workout.duration_minutes}m` : "—"}
            </p>
            <p
              className={`mt-0.5 text-xs ${workout.completed ? "text-emerald-400" : "text-slate-500"}`}
            >
              {workout.completed ? "Done" : "Planned"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkoutTypeBadge({ name }) {
  const lowerName = name.toLowerCase();
  const label =
    lowerName.includes("pull") || lowerName.includes("back")
      ? "Pull"
      : lowerName.includes("leg") || lowerName.includes("squat")
        ? "Legs"
        : lowerName.includes("push") || lowerName.includes("chest")
          ? "Push"
          : "Workout";
  const colors = {
    Pull: "bg-fuchsia-500/15 text-fuchsia-300",
    Legs: "bg-emerald-500/15 text-emerald-300",
    Push: "bg-blue-500/15 text-blue-300",
    Workout: "bg-amber-500/15 text-amber-300",
  };
  return (
    <span
      className={`rounded-md px-2 py-1 text-xs font-semibold ${colors[label]}`}
    >
      {label}
    </span>
  );
}

function CaloriesChart({ logs, target }) {
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

function RecordCard({ record }) {
  return (
    <div className="rounded-xl bg-white/[0.045] p-4">
      <p className="truncate text-sm text-slate-400">{record.exercise_name}</p>
      <strong className="mt-3 block text-2xl font-semibold text-violet-400">
        {formatNumber(record.value)} {record.unit}
      </strong>
      <p className="mt-2 text-xs text-emerald-400">Best recorded lift</p>
    </div>
  );
}
function ChartEmptyState({ icon: Icon, text }) {
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

function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      <p className="forge-kicker">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold uppercase text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}
function SectionLayout({ children }) {
  return <section className="mt-8">{children}</section>;
}
function EmptyState({ text }) {
  return (
    <div className="forge-panel rounded-2xl p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
function LoadingState() {
  return (
    <section className="forge-panel mt-8 rounded-2xl p-8 text-sm text-slate-400">
      Loading your dashboard...
    </section>
  );
}
function ErrorState({ message }) {
  return (
    <section className="forge-panel mt-8 rounded-2xl p-8 text-sm text-rose-300">
      Could not load your dashboard: {message}
    </section>
  );
}
function ProgramRequiredState() {
  return (
    <section className="forge-panel mt-8 grid min-h-[440px] place-items-center rounded-2xl px-6 py-14 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-violet-500/15 text-violet-400">
          <Sparkles size={34} />
        </span>
        <p className="forge-kicker mt-7">Your blueprint starts here</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase text-white md:text-3xl">
          Calculate your program first
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          Tell us about your goal, experience, and weekly schedule so we can
          build your personalized dashboard.
        </p>
        <Link
          to="/program"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-violet-500"
        >
          Calculate my program <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}

function inputClassName(extra = "") {
  return `h-11 w-full rounded-xl border border-violet-500/20 bg-[#0b0913] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400 ${extra}`;
}
function cleanNumbers(values) {
  const numeric = [
    "weight_kg",
    "body_fat_percent",
    "waist_cm",
    "calories",
    "protein_g",
    "carbs_g",
    "fat_g",
  ];
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      value === "" ? null : numeric.includes(key) ? Number(value) : value,
    ]),
  );
}
function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}
function formatNumber(value) {
  return new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(
    Number(value),
  );
}
function formatSignedNumber(value) {
  return `${value > 0 ? "+" : ""}${formatNumber(value)}`;
}
function formatShortDate(value) {
  return getDateKey(value);
}
function formatLongDate(value) {
  return getDateKey(value);
}
function getDateKey(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toISOString().slice(0, 10);
}
function isCurrentMonth(value) {
  const date = new Date(`${getDateKey(value)}T00:00:00`);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}
function getCurrentWeight(measurements, programWeight) {
  const latest = [...measurements]
    .filter((item) => item.weight_kg)
    .sort((a, b) =>
      getDateKey(b.measured_on).localeCompare(getDateKey(a.measured_on)),
    )[0];
  return latest?.weight_kg || programWeight || null;
}
function getWeightChange(measurements) {
  const values = measurements
    .filter((item) => item.weight_kg)
    .sort((a, b) =>
      getDateKey(a.measured_on).localeCompare(getDateKey(b.measured_on)),
    );
  return values.length > 1
    ? Number(values.at(-1).weight_kg) - Number(values[0].weight_kg)
    : null;
}
function getAverageDuration(workouts) {
  const values = workouts
    .map((item) => Number(item.duration_minutes))
    .filter(Boolean);
  return values.length
    ? Math.round(
        values.reduce((total, value) => total + value, 0) / values.length,
      )
    : null;
}
function getWeeklyCalories(logs) {
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
function getLastSevenDays() {
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
function getBestPersonalRecords(records) {
  const best = new Map();
  records.forEach((record) => {
    const key = `${record.exercise_name.toLowerCase()}-${record.unit}`;
    const current = best.get(key);
    if (!current || Number(record.value) > Number(current.value))
      best.set(key, { ...record, key });
  });
  return [...best.values()].sort((a, b) =>
    b.achieved_on.localeCompare(a.achieved_on),
  );
}

function ResourceForm({ fields, submitLabel, onSubmit, initialValues = {} }) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      setValues(initialValues);
    } catch (error) {
      toast.error("Could not save data", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form className="forge-panel mt-6 rounded-2xl p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={field.wide ? "sm:col-span-2" : ""}>
            <span className="mb-2 block text-xs uppercase tracking-wider text-slate-400">
              {field.label}
            </span>
            {field.type === "textarea" ? (
              <textarea
                value={values[field.name] || ""}
                onChange={(event) =>
                  setValues({ ...values, [field.name]: event.target.value })
                }
                className={inputClassName("min-h-24 resize-y py-3")}
                placeholder={field.placeholder}
              />
            ) : (
              <input
                required={field.required}
                type={field.type || "text"}
                min={field.min}
                max={field.max}
                step={field.step}
                value={values[field.name] || ""}
                onChange={(event) =>
                  setValues({ ...values, [field.name]: event.target.value })
                }
                className={inputClassName()}
                placeholder={field.placeholder}
              />
            )}
          </label>
        ))}
      </div>
      <button
        disabled={isSubmitting}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
      >
        <Plus size={16} />
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function DataRow({ children, onDelete }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.035] p-4">
      <div className="min-w-0">{children}</div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
        aria-label="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

function WorkoutSection({ program, workouts, onRefresh }) {
  const fields = [
    {
      name: "session_name",
      label: "Session name",
      required: true,
      placeholder: "Upper body",
    },
    { name: "workout_date", label: "Date", type: "date", required: true },
    {
      name: "duration_minutes",
      label: "Duration (minutes)",
      type: "number",
      min: 1,
    },
    { name: "notes", label: "Notes", type: "textarea", wide: true },
  ];
  async function add(values) {
    await createMemberResource("workout-logs", {
      ...values,
      program_id: program.id,
      duration_minutes: values.duration_minutes
        ? Number(values.duration_minutes)
        : null,
      completed: false,
    });
    await onRefresh();
  }
  async function toggle(item) {
    await updateMemberResource("workout-logs", item.id, {
      completed: !item.completed,
    });
    await onRefresh();
  }
  return (
    <SectionLayout>
      <SectionHeader
        eyebrow="Training history"
        title="Workout log"
        description="Log sessions and track completed workouts."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add workout"
        onSubmit={add}
        initialValues={{ workout_date: toDateInput(new Date()) }}
      />
      <div className="mt-5 space-y-3">
        {workouts.length ? (
          workouts.map((item) => (
            <DataRow
              key={item.id}
              onDelete={async () => {
                await deleteMemberResource("workout-logs", item.id);
                await onRefresh();
              }}
            >
              <button
                type="button"
                onClick={() => toggle(item)}
                className="flex items-center gap-3 text-left"
              >
                <span
                  className={`grid size-8 place-items-center rounded-lg ${item.completed ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-slate-500"}`}
                >
                  <Check size={16} />
                </span>
                <span>
                  <strong className="block text-sm text-white">
                    {item.session_name}
                  </strong>
                  <span className="text-xs text-slate-500">
                    {getDateKey(item.workout_date)}
                    {item.duration_minutes
                      ? ` · ${item.duration_minutes} min`
                      : ""}
                  </span>
                </span>
              </button>
            </DataRow>
          ))
        ) : (
          <EmptyState text="No workouts logged yet." />
        )}
      </div>
    </SectionLayout>
  );
}

function WeightSection({ measurements, onRefresh }) {
  const fields = [
    { name: "measured_on", label: "Date", type: "date", required: true },
    {
      name: "weight_kg",
      label: "Weight (kg)",
      type: "number",
      min: 20,
      max: 500,
      step: "0.01",
    },
    {
      name: "body_fat_percent",
      label: "Body fat (%)",
      type: "number",
      min: 1,
      max: 80,
      step: "0.01",
    },
    {
      name: "waist_cm",
      label: "Waist (cm)",
      type: "number",
      min: 20,
      max: 300,
      step: "0.01",
    },
  ];
  async function add(values) {
    await createMemberResource("body-measurements", cleanNumbers(values));
    await onRefresh();
  }
  return (
    <SectionLayout>
      <SectionHeader
        eyebrow="Body metrics"
        title="Weight progress"
        description="Track your body metrics to monitor progress."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add measurement"
        onSubmit={add}
        initialValues={{ measured_on: toDateInput(new Date()) }}
      />
      <div className="mt-5 space-y-3">
        {measurements.length ? (
          measurements.map((item) => (
            <DataRow
              key={item.id}
              onDelete={async () => {
                await deleteMemberResource("body-measurements", item.id);
                await onRefresh();
              }}
            >
              <strong className="block text-sm text-white">
                {getDateKey(item.measured_on)}
              </strong>
              <span className="text-xs text-slate-400">
                {item.weight_kg ? `${item.weight_kg} kg` : "—"} ·{" "}
                {item.body_fat_percent ? `${item.body_fat_percent}% fat` : "—"}{" "}
                · {item.waist_cm ? `${item.waist_cm} cm waist` : "—"}
              </span>
            </DataRow>
          ))
        ) : (
          <EmptyState text="No weight data yet." />
        )}
      </div>
    </SectionLayout>
  );
}

function NutritionSection({ program, logs, onRefresh }) {
  const target = program.nutrition_plan || {};
  const fields = [
    { name: "logged_on", label: "Date", type: "date", required: true },
    { name: "calories", label: "Calories", type: "number", min: 0 },
    {
      name: "protein_g",
      label: "Protein (g)",
      type: "number",
      min: 0,
      step: "0.1",
    },
    {
      name: "carbs_g",
      label: "Carbs (g)",
      type: "number",
      min: 0,
      step: "0.1",
    },
    { name: "fat_g", label: "Fat (g)", type: "number", min: 0, step: "0.1" },
  ];
  async function add(values) {
    await createMemberResource("nutrition-logs", cleanNumbers(values));
    await onRefresh();
  }
  return (
    <SectionLayout>
      <SectionHeader
        eyebrow="Daily targets"
        title="Nutrition"
        description={`Today's target: ${target.daily_calories || "—"} kcal`}
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add nutrition"
        onSubmit={add}
        initialValues={{ logged_on: toDateInput(new Date()) }}
      />
      <div className="mt-5 space-y-3">
        {logs.length ? (
          logs.map((item) => (
            <DataRow
              key={item.id}
              onDelete={async () => {
                await deleteMemberResource("nutrition-logs", item.id);
                await onRefresh();
              }}
            >
              <strong className="block text-sm text-white">
                {getDateKey(item.logged_on)} · {item.calories || 0} kcal
              </strong>
              <span className="text-xs text-slate-400">
                Protein {item.protein_g || 0}g · Carbs {item.carbs_g || 0}g ·
                Fat {item.fat_g || 0}g
              </span>
            </DataRow>
          ))
        ) : (
          <EmptyState text="No nutrition logs yet." />
        )}
      </div>
    </SectionLayout>
  );
}

function RecordsSection({ records, onRefresh }) {
  const fields = [
    {
      name: "exercise_name",
      label: "Exercise",
      required: true,
      placeholder: "Bench press",
    },
    {
      name: "value",
      label: "Value",
      type: "number",
      min: 0.01,
      step: "0.01",
      required: true,
    },
    { name: "unit", label: "Unit", required: true, placeholder: "kg / reps" },
    { name: "achieved_on", label: "Date", type: "date", required: true },
  ];
  async function add(values) {
    await createMemberResource("personal-records", {
      ...values,
      value: Number(values.value),
    });
    await onRefresh();
  }
  return (
    <SectionLayout>
      <SectionHeader
        eyebrow="Milestones"
        title="Personal records"
        description="Track your personal milestones and progress for each lift."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add record"
        onSubmit={add}
        initialValues={{ achieved_on: toDateInput(new Date()) }}
      />
      <div className="mt-5 space-y-3">
        {records.length ? (
          records.map((item) => (
            <DataRow
              key={item.id}
              onDelete={async () => {
                await deleteMemberResource("personal-records", item.id);
                await onRefresh();
              }}
            >
              <strong className="block text-sm text-white">
                {item.exercise_name} · {item.value} {item.unit}
              </strong>
              <span className="text-xs text-slate-400">
                Achieved on {getDateKey(item.achieved_on)}
              </span>
            </DataRow>
          ))
        ) : (
          <EmptyState text="No personal records yet." />
        )}
      </div>
    </SectionLayout>
  );
}
