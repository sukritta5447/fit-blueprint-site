import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navClasses } from "@/styles/navBar.styles";

const mobileLinks = [
  { label: "Home", to: "/" },
  { label: "Blog", to: "/blog" },
  { label: "AI Programs", to: "/program" },
  { label: "Log in", to: "/login" },
  { label: "Get Started", to: "/signup", primary: true },
];

export function GuestNav({ getLinkState }) {
  return (
    <>
      <nav className="hidden items-center gap-3 md:flex" aria-label="Account navigation">
        <Link
          to="/login"
          state={getLinkState("/login")}
          className={`${navClasses.linkBase} border border-violet-500/30 text-slate-200 hover:bg-violet-500/10`}
        >
          Log in
        </Link>
        <Link
          to="/signup"
          state={getLinkState("/signup")}
          className={`${navClasses.linkBase} bg-violet-600 text-white hover:bg-violet-500`}
        >
          Get Started
        </Link>
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger
          className="grid size-10 place-items-center text-white outline-none md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={28} strokeWidth={2} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[calc(100vw-2.5rem)] space-y-2 border-violet-500/20 bg-[#121020] p-5 text-white"
        >
          {mobileLinks.map((link) => (
            <DropdownMenuItem key={link.to} asChild>
              <Link
                to={link.to}
                state={getLinkState(link.to)}
                className={`${navClasses.mobileLinkBase} ${link.primary ? "bg-violet-600 text-white" : ""}`}
              >
                {link.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
