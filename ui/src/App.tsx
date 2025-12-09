import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { setupInterceptors } from "./services/api";
import { DialogProvider } from "./context/DialogContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CvBuilder from "./pages/CvBuilder";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetLinkExpiredPage from "./pages/ResetLinkExpiredPage";
import SharedCvPage from "./pages/SharedCvPage";
import CoverLetterEditor from "./components/CoverLetterEditor";
import CoverLetterPrintPage from "./pages/CoverLetterPrintPage";
import PdfPage from "./pages/PdfPage";
import "./index.css";
import { useEffect } from "react";

const AxiosInterceptorSetup = () => {
  const { showToast } = useToast();
  useEffect(() => {
    setupInterceptors(showToast);
  }, [showToast]);
  return null;
};

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

function App() {
  return (
    <ToastProvider>
      <AxiosInterceptorSetup />
      <DialogProvider>
        <AuthProvider>
          <Router>
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
              <Route
                path="/reset-link-expired"
                element={<ResetLinkExpiredPage />}
              />
              <Route path="/shared/:token" element={<SharedCvPage />} />
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
          </Router>
        </AuthProvider>
      </DialogProvider>
    </ToastProvider>
  );
}

export default App;
