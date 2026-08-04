import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import { AdminLayout } from "./components/admin/AdminLayout";
import { MemberAuthProvider } from "./contexts/MemberAuthProvider";
import { AdminProtectedRoute } from "./components/admin/AdminProtectedRoute";
import { MemberProtectedRoute } from "./components/member/MemberProtectedRoute";
import { AdminArticleFormPage } from "./pages/admin/AdminArticleFormPage";
import { AdminAccountsPage } from "./pages/admin/AdminAccountsPage";
import { AdminArticlesPage } from "./pages/admin/AdminArticlesPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminMembersPage } from "./pages/admin/AdminMembersPage";
import { AdminNotificationsPage } from "./pages/admin/AdminNotificationsPage";
import { AdminProfilePage } from "./pages/admin/AdminProfilePage";
import { AdminResetPasswordPage } from "./pages/admin/AdminResetPasswordPage";
import { ArticlePage } from "./pages/ArticlePage";
import { BlogPage } from "./pages/BlogPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { MemberDashboardPage } from "./pages/MemberDashboardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ProgramPage } from "./pages/ProgramPage";
import { SignupPage } from "./pages/SignupPage";
import { useMemberAuth } from "./hooks/useMemberAuth";
import { isAdminRole } from "./services/adminAuthStorage";

function AdminLoginRoute() {
  const { currentUser, isAuthLoading } = useMemberAuth();

  if (isAuthLoading) return null;

  if (currentUser && isAdminRole(currentUser.role)) {
    return <Navigate to="/admin/articles" replace />;
  }

  return <AdminLoginPage />;
}

function App() {
  return (
    <MemberAuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/program" element={<ProgramPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/member-management" element={<MemberProfilePage />} />
        <Route
          path="/member/dashboard"
          element={
            <MemberProtectedRoute>
              <MemberDashboardPage />
            </MemberProtectedRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/admin/login" element={<AdminLoginRoute />} />

        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/articles" replace />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="admins" element={<AdminAccountsPage />} />
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
    </MemberAuthProvider>
  );
}

export default App;
