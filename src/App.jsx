import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { AdminArticleFormPage } from "./pages/admin/AdminArticleFormPage";
import { AdminArticlesPage } from "./pages/admin/AdminArticlesPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { AdminProfilePage } from "./pages/admin/AdminProfilePage";
import { AdminResetPasswordPage } from "./pages/admin/AdminResetPasswordPage";
import { ArticlePage } from "./pages/ArticlePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { SignupPage } from "./pages/SignupPage";
import { getCurrentAdmin } from "./services/adminAuthStorage";

function AdminLoginRoute() {
  const currentAdmin = getCurrentAdmin();

  if (currentAdmin) {
    return <Navigate to="/admin/articles" replace />;
  }

  return <AdminLoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginRoute />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/member-management" element={<MemberProfilePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/articles" replace />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="articles/new" element={<AdminArticleFormPage />} />
          <Route path="articles/:id/edit" element={<AdminArticleFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="reset-password" element={<AdminResetPasswordPage />} />
        </Route>

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
