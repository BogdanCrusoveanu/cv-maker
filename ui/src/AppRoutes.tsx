import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetLinkExpiredPage from "./pages/ResetLinkExpiredPage";
import SharedCvPage from "./pages/SharedCvPage";
import SharedCoverLetterPage from "./pages/SharedCoverLetterPage";
import PdfPage from "./pages/PdfPage";
import DashboardPage from "./pages/DashboardPage";
import CvBuilder from "./pages/CvBuilder";
import CoverLetterEditor from "./components/CoverLetterEditor";
import CoverLetterPrintPage from "./pages/CoverLetterPrintPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPasswordPage />
          </GuestRoute>
        }
      />
      <Route path="/reset-link-expired" element={<ResetLinkExpiredPage />} />
      <Route path="/shared/:token" element={<SharedCvPage />} />
      <Route
        path="/shared-cover-letter/:token"
        element={<SharedCoverLetterPage />}
      />
      <Route path="/pdf/:id" element={<PdfPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:id?"
        element={
          <ProtectedRoute>
            <CvBuilder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter"
        element={
          <ProtectedRoute>
            <CoverLetterEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter/:id"
        element={
          <ProtectedRoute>
            <CoverLetterEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cover-letter/:id/print"
        element={<CoverLetterPrintPage />}
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
