import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Sparkles,
  Trophy,
  Utensils,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getApiErrorMessage } from "@/services/apiClient";
import { getMemberDashboardData } from "@/services/memberDashboardService";
import {
  NutritionSection,
  RecordsSection,
  WeightSection,
  WorkoutSection,
} from "@/components/member/DashboardLogSections";
import {
  formatNumber,
  formatSignedNumber,
  getAverageDuration,
  getBestPersonalRecords,
  getCurrentWeight,
  getDateKey,
  getWeeklyCalories,
  getWeightChange,
  isCurrentMonth,
} from "@/utils/memberDashboard";
import {
  CaloriesChart,
  ChartEmptyState,
  ProgressRing,
  WeightChart,
} from "@/components/member/DashboardCharts";
import { cn, getInitials } from "@/utils/utils";

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
              <DashboardContent
                dashboard={dashboard}
                activeSection={activeSection}
                onRefresh={refreshDashboard}
                isLoading={isLoading}
                error={loadError}
              />
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
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 text-left text-xs transition sm:text-sm",
              activeSection === id
                ? "bg-violet-600/20 text-violet-300"
                : "text-slate-500 hover:bg-white/5 hover:text-slate-200",
            )}
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

function DashboardContent({ dashboard, activeSection, onRefresh, isLoading, error }) {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!dashboard?.program) return <ProgramRequiredState />;

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
    <section className={cn("forge-panel rounded-2xl p-5 md:p-6", className)}>
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
        className={cn("grid size-11 place-items-center rounded-xl", tones[tone])}
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
                {getDateKey(workout.workout_date)}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm text-slate-300">
              {workout.duration_minutes ? `${workout.duration_minutes}m` : "—"}
            </p>
            <p
              className={cn(
                "mt-0.5 text-xs",
                workout.completed ? "text-emerald-400" : "text-slate-500",
              )}
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
  let label = "Workout";

  if (lowerName.includes("pull") || lowerName.includes("back")) {
    label = "Pull";
  } else if (lowerName.includes("leg") || lowerName.includes("squat")) {
    label = "Legs";
  } else if (lowerName.includes("push") || lowerName.includes("chest")) {
    label = "Push";
  }
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
