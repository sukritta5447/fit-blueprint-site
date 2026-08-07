import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-[520px] h-[clamp(520px,62vw,780px)] max-h-[780px] w-full items-center overflow-hidden bg-[#0b0913] px-5 py-16 sm:px-8 md:px-12 lg:px-20 xl:px-32">
      <img
        src="/assets/hero-fitness.png"
        alt=""
        className="absolute left-1/2 top-0 -z-20 h-full w-full max-w-[1920px] -translate-x-1/2 object-cover object-[65%_28%]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
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
      </div>
    </section>
  );
}
