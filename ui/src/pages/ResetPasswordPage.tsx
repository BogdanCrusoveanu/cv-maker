import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { AuthLayout } from "../components/auth/AuthLayout";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { encryptPassword } = useAuth(); // Assuming useAuth exposes encryptPassword
  const { t } = useTranslation();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !email) {
      navigate("/reset-link-expired");
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.errors.passwordsDoNotMatch", "Passwords do not match"));
      return;
    }

    if (password.length < 6) {
      setError(
        t(
          "auth.errors.passwordTooShort",
          "Password must be at least 6 characters"
        )
      );
      return;
    }

    setIsLoading(true);

    try {
      const encryptedPassword = encryptPassword(password);
      await api.post("/auth/reset-password", {
        email,
        token,
        newPassword: encryptedPassword,
      });

      showToast(
        t(
          "auth.toasts.resetSuccess",
          "Password reset successfully. Please login."
        ),
        "success"
      );
      navigate("/login");
    } catch (err: any) {
      console.error("Reset password error", err);
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 404)
      ) {
        navigate("/reset-link-expired");
      } else {
        setError(
          t("common.errors.generic", "An error occurred. Please try again.")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.resetPasswordTitle")}
      subtitle={t("auth.resetPasswordSubtitle")}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            label={t("auth.newPasswordLabel")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="h-12"
          />
          <Input
            label={t("auth.confirmNewPasswordLabel")}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="h-12"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          disabled={isLoading}
        >
          {isLoading
            ? t("auth.resettingPassword")
            : t("auth.resetPasswordButton")}
        </Button>
      </form>
    </AuthLayout>
  );
}
