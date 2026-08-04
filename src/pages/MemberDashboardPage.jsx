import {
  Activity,
  ArrowRight,
  CalendarDays,
  Dumbbell,
  Flame,
  LayoutDashboard,
  Sparkles,
  Trophy,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { getMemberProgram } from "@/services/memberProgramStorage";
import { getInitials } from "@/utils/utils";

const dashboardSections = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Weight progress", icon: Activity },
  { label: "Workout log", icon: Dumbbell },
  { label: "Nutrition", icon: Utensils },
  { label: "Personal records", icon: Trophy },
];

export function MemberDashboardPage() {
  const { currentUser } = useMemberAuth();
  const memberProgram = getMemberProgram(currentUser?.email);
  const displayName = currentUser?.name || currentUser?.username || "Athlete";

  return (
    <PageShell>
      <main>
        <Container className="py-10 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <DashboardSidebar user={currentUser} />

            <div className="min-w-0">
              <div>
                <p className="forge-kicker">Member dashboard</p>
                <h1 className="mt-3 text-3xl font-semibold uppercase text-white md:text-4xl">
                  Welcome back, <span className="text-violet-400">{displayName}</span>
                </h1>
                <p className="mt-3 text-sm text-slate-400">
                  Here&apos;s your fitness snapshot. Keep pushing forward.
                </p>
              </div>

              {memberProgram ? (
                <DashboardOverview program={memberProgram} />
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

function DashboardSidebar({ user }) {
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
          <p className="truncate text-sm font-semibold text-white">{displayName}</p>
          <p className="mt-1 text-xs text-violet-400">JB Fit Member</p>
        </div>
      </div>

      <nav className="mt-4 grid grid-cols-2 gap-1 lg:grid-cols-1" aria-label="Dashboard sections">
        {dashboardSections.map(({ label, icon: Icon, active }) => (
          <span
            key={label}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xs sm:text-sm ${
              active
                ? "bg-violet-600/20 text-violet-300"
                : "text-slate-500"
            }`}
          >
            <Icon size={17} aria-hidden="true" />
            {label}
          </span>
        ))}
      </nav>

      <Link
        to="/program"
        className="mt-5 flex items-center gap-3 rounded-xl border border-violet-500/20 px-3 py-3 text-sm text-slate-300 transition hover:bg-violet-500/10 hover:text-white"
      >
        <Sparkles size={17} className="text-violet-400" aria-hidden="true" />
        New program
      </Link>
    </aside>
  );
}

function ProgramRequiredState() {
  return (
    <section className="forge-panel mt-8 grid min-h-[440px] place-items-center rounded-2xl px-6 py-14 text-center">
      <div className="max-w-lg">
        <span className="mx-auto grid size-20 place-items-center rounded-2xl bg-violet-500/15 text-violet-400">
          <Sparkles size={34} aria-hidden="true" />
        </span>
        <p className="forge-kicker mt-7">Your blueprint starts here</p>
        <h2 className="mt-4 text-2xl font-semibold uppercase text-white md:text-3xl">
          Calculate your program first
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
          Tell us about your goal, experience, and weekly schedule so we can build
          your personalized workout and nutrition dashboard.
        </p>
        <Link
          to="/program"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          Calculate my program
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function DashboardOverview({ program }) {
  const workoutDays = Number(program.days) || 4;
  const goal = program.goal || "General fitness";

  return (
    <>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Flame} label="Current streak" value="0 days" note="Start your first workout" />
        <Stat icon={Dumbbell} label="Weekly workouts" value={`${workoutDays} days`} note={`${goal} plan`} />
        <Stat icon={Activity} label="Plan progress" value="0%" note="Ready to begin" />
        <Stat icon={CalendarDays} label="Program created" value={formatProgramDate(program.calculatedAt)} note="Personalized for you" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="forge-panel rounded-2xl p-6">
          <p className="forge-kicker">Your plan</p>
          <h2 className="mt-3 text-xl font-semibold uppercase text-white">{goal}</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: workoutDays }, (_, index) => (
              <div key={index} className="rounded-xl bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-wider text-violet-400">Day {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-white">Training session</p>
                <p className="mt-1 text-xs text-slate-500">Workout details ready to follow</p>
              </div>
            ))}
          </div>
        </section>

        <section className="forge-panel rounded-2xl p-6 text-center">
          <p className="forge-kicker">Weekly goal</p>
          <div className="mx-auto mt-7 grid size-40 place-items-center rounded-full border-[12px] border-violet-500/20">
            <div>
              <strong className="block text-3xl text-violet-400">0%</strong>
              <span className="text-xs text-slate-500">completed</span>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-400">0 of {workoutDays} sessions done</p>
        </section>
      </div>
    </>
  );
}

function Stat({ icon: Icon, label, value, note }) {
  return (
    <div className="forge-panel rounded-2xl p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-violet-400">
        <Icon size={19} aria-hidden="true" />
      </span>
      <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <strong className="mt-2 block text-xl text-white">{value}</strong>
      <span className="mt-2 block text-xs text-violet-300">{note}</span>
    </div>
  );
}

function formatProgramDate(date) {
  if (!date) return "Today";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
