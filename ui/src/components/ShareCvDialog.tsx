import { useState, useEffect } from "react";
import { X, Copy, Share2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

interface ShareCvDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cvId: number;
  initialPublicToken?: string | null;
  onShareChange?: (token: string | null) => void;
}

export const ShareCvDialog: React.FC<ShareCvDialogProps> = ({
  isOpen,
  onClose,
  cvId,
  initialPublicToken,
  onShareChange,
}) => {
  const [publicToken, setPublicToken] = useState<string | null>(
    initialPublicToken || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    setPublicToken(initialPublicToken || null);
  }, [initialPublicToken]);

  if (!isOpen) return null;

  const shareUrl = publicToken
    ? `${window.location.origin}/shared/${publicToken}`
    : "";

  const handleShare = async () => {
    setIsLoading(true);
    try {
      const response = await api.shareCv(cvId);
      const token = response.data.token;
      setPublicToken(token);
      if (onShareChange) onShareChange(token);
      showToast(t("app.toasts.shareSuccess"), "success");
    } catch (error) {
      console.error("Failed to share CV", error);
      showToast(t("app.toasts.shareError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnshare = async () => {
    setIsLoading(true);
    try {
      await api.unshareCv(cvId);
      setPublicToken(null);
      if (onShareChange) onShareChange(null);
      showToast(t("app.toasts.unshareSuccess"), "success");
    } catch (error) {
      console.error("Failed to unshare CV", error);
      showToast(t("app.toasts.unshareError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    showToast(t("app.toasts.copySuccess"), "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Share2 className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t("shareDialog.title")}
          </h2>
          <p className="text-gray-500 mt-2">
            {publicToken
              ? t("shareDialog.descriptionPublic")
              : t("shareDialog.descriptionPrivate")}
          </p>
        </div>

        {publicToken ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1 bg-gray-50" />
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                icon={Copy}
                title={t("shareDialog.copy")}
              >
                {t("shareDialog.copy")}
              </Button>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                onClick={handleUnshare}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                icon={Trash2}
                disabled={isLoading}
              >
                {isLoading
                  ? t("shareDialog.unsharing")
                  : t("shareDialog.stopSharing")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              onClick={handleShare}
              className="w-full py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              disabled={isLoading}
            >
              {isLoading
                ? t("shareDialog.creatingLink")
                : t("shareDialog.createLink")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
