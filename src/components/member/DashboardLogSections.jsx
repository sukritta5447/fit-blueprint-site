import { Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/services/apiClient";
import {
  createMemberResource,
  deleteMemberResource,
  updateMemberResource,
} from "@/services/memberDashboardService";
import { cleanNumbers, getDateKey, toDateInput } from "@/utils/memberDashboard";
import { cn } from "@/utils/utils";

const inputClassName =
  "h-11 w-full rounded-xl border border-violet-500/20 bg-[#0b0913] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-violet-400";

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

function EmptyState({ text }) {
  return (
    <div className="forge-panel rounded-2xl p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function ResourceForm({ fields, submitLabel, onSubmit, initialValues = {} }) {
  const [values, setValues] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

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
                name={field.name}
                onChange={handleChange}
                className={cn(inputClassName, "min-h-24 resize-y py-3")}
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
                name={field.name}
                onChange={handleChange}
                className={inputClassName}
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

export function WorkoutSection({ program, workouts, onRefresh }) {
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

  async function handleAddWorkout(values) {
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

  async function handleToggleWorkout(item) {
    await updateMemberResource("workout-logs", item.id, {
      completed: !item.completed,
    });
    await onRefresh();
  }

  return (
    <section className="mt-8">
      <SectionHeader
        eyebrow="Training history"
        title="Workout log"
        description="Log sessions and track completed workouts."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add workout"
        onSubmit={handleAddWorkout}
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
                onClick={() => handleToggleWorkout(item)}
                className="flex items-center gap-3 text-left"
              >
                <span
                  className={cn(
                    "grid size-8 place-items-center rounded-lg",
                    item.completed
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-white/5 text-slate-500",
                  )}
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
    </section>
  );
}

export function WeightSection({ measurements, onRefresh }) {
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

  async function handleAddMeasurement(values) {
    await createMemberResource("body-measurements", cleanNumbers(values));
    await onRefresh();
  }

  return (
    <section className="mt-8">
      <SectionHeader
        eyebrow="Body metrics"
        title="Weight progress"
        description="Track your body metrics to monitor progress."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add measurement"
        onSubmit={handleAddMeasurement}
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
    </section>
  );
}

export function NutritionSection({ program, logs, onRefresh }) {
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

  async function handleAddNutrition(values) {
    await createMemberResource("nutrition-logs", cleanNumbers(values));
    await onRefresh();
  }

  return (
    <section className="mt-8">
      <SectionHeader
        eyebrow="Daily targets"
        title="Nutrition"
        description={`Today's target: ${target.daily_calories || "—"} kcal`}
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add nutrition"
        onSubmit={handleAddNutrition}
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
    </section>
  );
}

export function RecordsSection({ records, onRefresh }) {
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

  async function handleAddRecord(values) {
    await createMemberResource("personal-records", {
      ...values,
      value: Number(values.value),
    });
    await onRefresh();
  }

  return (
    <section className="mt-8">
      <SectionHeader
        eyebrow="Milestones"
        title="Personal records"
        description="Track your personal milestones and progress for each lift."
      />
      <ResourceForm
        fields={fields}
        submitLabel="Add record"
        onSubmit={handleAddRecord}
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
    </section>
  );
}
