import { Footer } from "@/components/Footer";
import { NavBar } from "@/components/nav/NavBar";

export function PageShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
