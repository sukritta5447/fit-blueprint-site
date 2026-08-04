import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesColumnIncreasing,
  Utensils,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ArticleCard } from "@/components/articles/ArticleCard";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Workout Designer",
    text: "Training plans shaped around your goal, schedule, equipment, and experience.",
  },
  {
    icon: Utensils,
    title: "Nutrition Architect",
    text: "Practical macro targets and meals that match your dietary preferences.",
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: "Progress Intelligence",
    text: "A clear view of training consistency, body metrics, and performance trends.",
  },
];

export function LandingSections({ articles }) {
  return (
    <>
      <section className="py-16">
        <div className="text-center">
          <p className="forge-kicker">Platform features</p>
          <h2 className="mt-4 text-3xl font-semibold uppercase text-white md:text-4xl">
            Everything you need{" "}
            <span className="text-violet-400">to dominate</span>
          </h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="forge-panel rounded-2xl p-7">
              <span className="grid size-12 place-items-center rounded-xl bg-violet-500/15 text-violet-400">
                <Icon size={22} />
              </span>
              <h3 className="mt-6 text-lg font-semibold uppercase text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-12 py-16 lg:grid-cols-2">
        <div>
          <p className="forge-kicker">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold uppercase text-white md:text-4xl">
            Three steps to{" "}
            <span className="text-violet-400">your best self</span>
          </h2>
          <div className="mt-9 space-y-7">
            {[
              [
                "01",
                "Create your profile",
                "Tell us your goal, schedule, equipment, and preferences.",
              ],
              [
                "02",
                "AI assessment",
                "The program maps a realistic path from your current starting point.",
              ],
              [
                "03",
                "Get your program",
                "Review a weekly workout and nutrition blueprint built around you.",
              ],
            ].map(([number, title, text]) => (
              <div key={number} className="grid grid-cols-[48px_1fr] gap-4">
                <strong className="text-xl text-violet-500">{number}</strong>
                <div>
                  <h3 className="font-semibold uppercase text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-violet-500/20">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80"
            alt="Athlete preparing for a workout"
            className="h-[430px] w-full object-cover opacity-75"
          />
        </div>
      </section>

      <section className="py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="forge-kicker">Latest articles</p>
            <h2 className="mt-4 text-3xl font-semibold uppercase text-white">
              From the blog
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-violet-300 hover:text-violet-200"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </section>

      <section className="my-16 rounded-3xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-6 py-14 text-center md:px-12">
        <h2 className="text-3xl font-semibold uppercase text-white">
          Ready to change your body?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-violet-100">
          Create a profile and start shaping a program around the life you
          actually live.
        </p>
        <Link
          className="mt-7 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700"
          to="/signup"
        >
          Create Free Account
        </Link>
      </section>
    </>
  );
}
