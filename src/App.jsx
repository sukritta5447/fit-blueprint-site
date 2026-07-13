import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { ArticlePage } from "./pages/ArticlePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignupPage } from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/member-management" element={<MemberProfilePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        richColors
        closeButton
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "rounded-xl px-5 py-4 shadow-lg",
            title: "text-base font-semibold",
            description: "text-sm",
            closeButton: "jb-toast-close-button",
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
