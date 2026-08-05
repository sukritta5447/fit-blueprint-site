import { Flame } from "lucide-react";
import { Link } from "react-router-dom";

import { Container } from "./common/Container";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-violet-500/15 bg-[#0d0b18] py-12">
      <Container>
        <div className="grid gap-10 md:grid-cols-[2fr_repeat(2,minmax(0,1fr))] md:gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-3 text-lg font-semibold tracking-[0.08em]">
              <span className="grid size-9 place-items-center rounded-xl bg-violet-600">
                <Flame size={18} aria-hidden="true" />
              </span>
              <span>
                JB <span className="text-violet-400">FIT BLUEPRINT</span>
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-500">
              AI-powered fitness designed to help you reach peak performance.
            </p>
          </div>
          <FooterColumn
            title="Platform"
            links={[
              ["AI Programs", "/program"],
              ["Progress Tracker", "/member/dashboard"],
            ]}
          />
          <FooterColumn title="Resources" links={[["Blog", "/blog"]]} />
        </div>
        <div className="mt-10 border-t border-violet-500/10 pt-6 text-xs text-slate-600">
          © 2026 JB Fit Blueprint. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-violet-400">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-sm text-slate-400">
        {links.map(([label, to]) => (
          <Link key={label} className="block hover:text-white" to={to}>
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
