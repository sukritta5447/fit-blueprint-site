import { BrainCircuit, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Container } from "@/components/common/Container";
import { PageShell } from "@/components/common/PageShell";
import { Input } from "@/components/ui/input";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { apiClient, getApiErrorMessage } from "@/services/apiClient";
import { saveMemberProgram } from "@/services/memberProgramStorage";

const fieldClass =
  "h-11 rounded-xl border-violet-500/20 bg-[#0b0913] px-4 text-white shadow-none placeholder:text-slate-600";

export function ProgramPage() {
  const navigate = useNavigate();
  const { currentUser } = useMemberAuth();
  const [days, setDays] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      toast.info("Log in to save your program", {
        description: "Your dashboard is available after you log in.",
      });
      navigate("/login", { state: { from: "/program" } });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const input = {
      age: Number(formData.get("age")),
      weight_kg: Number(formData.get("weight_kg")),
      height_cm: Number(formData.get("height_cm")),
      gender: formData.get("gender"),
      goal: formData.get("goal"),
      experience: formData.get("experience"),
      days_per_week: Number(days),
      diet: formData.get("diet"),
      restrictions: formData.get("restrictions")?.trim() || "",
      injuries: formData.get("restrictions")?.trim() || "",
    };

    setIsSubmitting(true);

    try {
      const { data: response } = await apiClient.post(
        "/programs/calculate",
        input,
      );
      const program = response.data;

      setResult(response);
      saveMemberProgram(currentUser.email, {
        age: input.age,
        weight: input.weight_kg,
        height: input.height_cm,
        gender: input.gender,
        goal: input.goal,
        experience: input.experience,
        days: input.days_per_week,
        diet: input.diet,
        restrictions: input.restrictions,
        calculation: response.calculation,
        workoutPlan: program.workout_plan,
        nutritionPlan: program.nutrition_plan,
        calculatedAt: program.calculated_at,
      });

      toast.success("Your program is ready", {
        description:
          "Your personalized workout and nutrition plan has been created.",
      });
    } catch (error) {
      if (
        error.code === "AUTH_SESSION_MISSING" ||
        error.code === "AUTH_SESSION_UNAVAILABLE" ||
        error.response?.status === 401
      ) {
        toast.info("Please log in again", {
          description: "Your login session is no longer valid.",
        });
        navigate("/login", { state: { from: "/program" } });
        return;
      }

      toast.error("Could not generate your program", {
        description: getApiErrorMessage(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell>
      <main>
        <Container className="py-14 md:py-20">
          <p className="forge-kicker">AI engine</p>
          <h1 className="mt-5 text-4xl font-semibold uppercase text-white md:text-5xl">
            Build your <span className="text-violet-400">program</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-400">
            Complete your profile to preview the information used for a
            personalized workout and nutrition plan.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <form
              className="forge-panel rounded-2xl p-6 md:p-8"
              aria-labelledby="program-profile-title"
              onSubmit={handleSubmit}
            >
              <h2
                id="program-profile-title"
                className="text-xl font-semibold uppercase text-white"
              >
                Your profile
              </h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <ProgramField label="Age">
                  <Input
                    name="age"
                    type="number"
                    min="13"
                    required
                    className={fieldClass}
                    placeholder="e.g. 28"
                  />
                </ProgramField>
                <ProgramField label="Weight (kg)">
                  <Input
                    name="weight_kg"
                    type="number"
                    min="20"
                    step="0.1"
                    required
                    className={fieldClass}
                    placeholder="e.g. 82"
                  />
                </ProgramField>
                <ProgramField label="Height (cm)">
                  <Input
                    name="height_cm"
                    type="number"
                    min="100"
                    required
                    className={fieldClass}
                    placeholder="e.g. 180"
                  />
                </ProgramField>
                <ProgramSelect
                  name="gender"
                  label="Gender"
                  options={["Male", "Female", "Prefer not to say"]}
                />
                <ProgramSelect
                  name="goal"
                  label="Fitness goal"
                  options={[
                    "Muscle gain",
                    "Fat loss",
                    "Endurance",
                    "General fitness",
                  ]}
                  full
                />
                <ProgramSelect
                  name="experience"
                  label="Experience level"
                  options={["Beginner", "Intermediate", "Advanced"]}
                  full
                />
                <label className="space-y-3 sm:col-span-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400">
                    Days per week:{" "}
                    <strong className="text-violet-400">{days}</strong>
                  </span>
                  <input
                    className="w-full accent-violet-600"
                    type="range"
                    min="2"
                    max="6"
                    value={days}
                    onChange={(event) => setDays(event.target.value)}
                  />
                </label>
                <ProgramSelect
                  name="diet"
                  label="Diet preference"
                  options={[
                    "Standard",
                    "High protein",
                    "Vegetarian",
                    "Plant based",
                  ]}
                  full
                />
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400">
                    Health restrictions / notes
                  </span>
                  <textarea
                    name="restrictions"
                    rows={3}
                    className="w-full rounded-xl border border-violet-500/20 bg-[#0b0913] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-500"
                    placeholder="e.g. knee injury, lactose intolerant"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Zap size={17} />{" "}
                {isSubmitting ? "Generating..." : "Generate My Program"}
              </button>
            </form>

            <section
              className="forge-panel grid min-h-[520px] place-items-center rounded-2xl p-8 text-center"
              aria-labelledby="program-empty-title"
            >
              {result ? (
                <ProgramResult result={result} />
              ) : (
                <div>
                  <span className="mx-auto grid size-20 place-items-center rounded-full bg-violet-500/15 text-violet-400">
                    <BrainCircuit size={34} />
                  </span>
                  <h2
                    id="program-empty-title"
                    className="mt-6 text-2xl font-semibold uppercase text-white"
                  >
                    Are you ready?
                  </h2>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-400">
                    Submit your profile to generate a personalized workout and
                    nutrition plan.
                  </p>
                </div>
              )}
            </section>
          </div>
        </Container>
      </main>
    </PageShell>
  );
}

function ProgramResult({ result }) {
  const { calculation, data } = result;
  const macros = calculation.macros;
  const days = data.workout_plan?.days || [];
  const nutritionPlan = data.nutrition_plan || {};
  const mealGuidance = Array.isArray(nutritionPlan.meal_guidance)
    ? nutritionPlan.meal_guidance
    : nutritionPlan.meal_guidance
      ? [nutritionPlan.meal_guidance]
      : [];
  const foodSuggestions = Array.isArray(nutritionPlan.food_suggestions)
    ? nutritionPlan.food_suggestions
    : [];

  return (
    <div className="w-full text-left">
      <p className="forge-kicker">Your blueprint</p>
      <h2 className="mt-3 text-2xl font-semibold uppercase text-white">
        Program generated
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ResultStat
          label="Calories"
          value={`${calculation.daily_calories}`}
          unit="kcal"
        />
        <ResultStat label="Protein" value={`${macros.protein_g}`} unit="g" />
        <ResultStat label="Carbs" value={`${macros.carbs_g}`} unit="g" />
        <ResultStat label="Fat" value={`${macros.fat_g}`} unit="g" />
      </div>
      <div className="mt-6 rounded-xl bg-white/[0.035] p-4">
        <p className="text-xs uppercase tracking-wider text-violet-400">
          Weekly training
        </p>
        <p className="mt-2 text-sm text-white">
          {days.length} sessions planned
        </p>
        <div className="mt-3 space-y-2">
          {days.slice(0, 3).map((day) => (
            <div
              key={day.day}
              className="flex items-center justify-between gap-3 text-xs text-slate-400"
            >
              <span>{day.name}</span>
              <span>{day.exercises?.length || 0} exercises</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-white/[0.035] p-4">
        <p className="text-xs uppercase tracking-wider text-violet-400">
          Nutrition guidance
        </p>
        {mealGuidance.length ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {mealGuidance.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No nutrition guidance available.
          </p>
        )}
      </div>
      <div className="mt-4 rounded-xl bg-white/[0.035] p-4">
        <p className="text-xs uppercase tracking-wider text-violet-400">
          Food suggestions
        </p>
        {foodSuggestions.length ? (
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {foodSuggestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No food suggestions available.
          </p>
        )}
      </div>
      {result.ai_explanation && (
        <div className="mt-4 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] p-4">
          <p className="text-xs uppercase tracking-wider text-violet-400">
            AI coach notes
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            {result.ai_explanation}
          </p>
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value, unit }) {
  return (
    <div className="rounded-xl bg-white/[0.035] p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">
        {value}
        <span className="ml-1 text-xs font-normal text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

function ProgramField({ label, children }) {
  return (
    <label className="space-y-2">
      <span className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function ProgramSelect({ name, label, options, full = false }) {
  return (
    <label className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <select name={name} className={`${fieldClass} w-full`}>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? {
                  label: option,
                  value: option.toLowerCase().replaceAll(" ", "_"),
                }
              : option;
          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}
