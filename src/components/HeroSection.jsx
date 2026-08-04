import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="grid min-h-[620px] items-center gap-10 py-16 lg:grid-cols-[1.05fr_.95fr]">
      <div>
        <p className="forge-kicker">
          <Sparkles size={14} /> Expert guided fitness platform
        </p>
        <h1 className="mt-6 max-w-[9ch] text-5xl font-semibold uppercase leading-[0.98] tracking-tight text-white md:text-7xl">
          Build <span className="forge-gradient-text">your strongest</span> self
        </h1>
        <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
          Stop guessing. Start training with programs built around your body,
          goals, schedule, and lifestyle.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
            to="/program"
          >
            Build My Program <ArrowRight size={17} />
          </Link>
          <Link
            className="rounded-xl border border-violet-500/25 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500/10"
            to="/blog"
          >
            Read the Blog
          </Link>
        </div>
      </div>
      <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-violet-500/20 bg-[#100d1d]">
        <img
          src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1100&q=85"
          alt="Athlete strength training"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-violet-950/35" />
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/45 p-5 backdrop-blur">
          <p className="text-xs uppercase tracking-wider text-violet-300">
            Today’s focus
          </p>
          <p className="mt-2 text-xl font-semibold text-white">
            Upper strength · 52 min
          </p>
        </div>
      </div>
    </section>
  );
}
