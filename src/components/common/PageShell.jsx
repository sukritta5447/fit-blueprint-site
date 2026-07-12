import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

export function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
