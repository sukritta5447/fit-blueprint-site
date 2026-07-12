import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/NavBar";

export function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-[#f8f7f4] text-neutral-900">
      <NavBar />
      {children}
      <Footer />
    </div>
  );
}
