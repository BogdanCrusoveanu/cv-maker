import { useNavigate } from "react-router-dom";
import { ShareCvDialog } from "../components/ShareCvDialog";
import { FileText, Edit, Trash2, Clock, Share2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useCvs, useDeleteCv } from "../hooks/useCv";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import { useToast } from "../context/ToastContext";
import { useState } from "react";
import { ChangePasswordDialog } from "../components/auth/ChangePasswordDialog";
import { Navbar } from "../components/layout/Navbar";
import { CvPreview } from "../components/CvPreview";
import { useTranslation } from "react-i18next";
import { useCoverLetters, useDeleteCoverLetter } from "../hooks/useCoverLetter";
import CoverLetterPreview from "../components/CoverLetterPreview";

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, deleteAccount } = useAuth();
  const { data: cvs, isLoading: isLoadingCvs, isError: isErrorCvs } = useCvs();
  const {
    data: coverLetters,
    isLoading: isLoadingCLs,
    isError: isErrorCLs,
  } = useCoverLetters();

  const deleteCvMutation = useDeleteCv();
  const deleteCoverLetterMutation = useDeleteCoverLetter();

  const dialog = useDialog();
  const { showToast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareCvId, setShareCvId] = useState<number | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cvs" | "coverLetters">("cvs");

  const handleDeleteAccount = async () => {
    const isConfirmed = await dialog.confirm({
      title: t("app.dialogs.deleteAccountTitle"),
      message: t("app.dialogs.deleteAccountMessage"),
    });

    if (isConfirmed) {
      try {
        await deleteAccount();
        showToast(t("app.toasts.accountDeleted"), "success");
        navigate("/login");
      } catch (error) {
        console.error("Failed to delete account", error);
        showToast(t("app.toasts.accountDeleteFailed"), "error");
      }
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    const isConfirmed = await dialog.confirm({
      title: t("app.dialogs.deleteCvTitle"),
      message: t("app.dialogs.deleteCvMessage"),
    });

    if (isConfirmed) {
      try {
        await deleteCvMutation.mutateAsync(id);
        showToast(t("app.toasts.cvDeleted"), "success");
      } catch (error) {
        console.error("Failed to delete CV", error);
        showToast(t("app.toasts.cvDeleteFailed"), "error");
      }
    }
  };

  const handleDeleteCoverLetter = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const isConfirmed = await dialog.confirm({
      title: t("app.dialogs.deleteCoverLetterTitle", "Delete Cover Letter"),
      message: t(
        "app.dialogs.deleteCoverLetterMessage",
        "Are you sure you want to delete this cover letter?"
      ),
    });

    if (isConfirmed) {
      try {
        await deleteCoverLetterMutation.mutateAsync(id);
        showToast(
          t("app.toasts.coverLetterDeleted", "Cover Letter deleted"),
          "success"
        );
      } catch (error) {
        console.error("Failed to delete Cover Letter", error);
        showToast(
          t("app.toasts.coverLetterDeleteFailed", "Failed to delete"),
          "error"
        );
      }
    }
  };

  const handleEdit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/editor/${id}`);
  };

  const handleCreate = () => {
    if (activeTab === "cvs") {
      navigate("/editor");
    } else {
      navigate("/cover-letter");
    }
  };

  const isLoading = activeTab === "cvs" ? isLoadingCvs : isLoadingCLs;
  const isError = activeTab === "cvs" ? isErrorCvs : isErrorCLs;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (isError)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-red-500 gap-4">
        <p className="text-xl font-semibold">{t("app.errorLoading")}</p>
        <Button onClick={() => window.location.reload()} variant="ghost">
          {t("app.retry")}
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onLogout={logout}
        onChangePassword={() => setIsPasswordDialogOpen(true)}
        onCreateCv={handleCreate}
        onDeleteAccount={handleDeleteAccount}
        activeTab={activeTab}
      />

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("app.dashboard")}
            </h1>
            <p className="mt-2 text-gray-600">{t("app.dashboardSubtitle")}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("cvs")}
            className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "cvs"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("app.myCvs")}
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {cvs?.length || 0}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("coverLetters")}
            className={`py-4 px-6 font-medium text-sm transition-colors border-b-2 ${
              activeTab === "coverLetters"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t("app.coverLetters", "Cover Letters")}
            {/* We'll add count here when we have the hook */}
          </button>
        </div>

        {activeTab === "cvs" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New Card (First Item) */}
            <div
              onClick={handleCreate}
              className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-80 animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors mb-4">
                <FileText className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                {t("app.createNew")}
              </h3>
              <p className="text-sm text-gray-500 mt-2 text-center px-4">
                {t("app.startFromScratch")}
              </p>
            </div>

            {cvs &&
              cvs.map((cv, index) => (
                <div
                  key={cv.id}
                  onClick={() => navigate(`/editor/${cv.id}`)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-80 relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Card Header / Preview Area */}
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative p-6 flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                    <div className="bg-white shadow-md w-32 h-40 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 flex flex-col">
                      <CvPreview
                        template={
                          JSON.parse(cv.data || "{}").template || "modern"
                        }
                      />
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                      <button
                        onClick={(e) => handleEdit(cv.id, e)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
                        title={t("app.edit")}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShareCvId(cv.id);
                          setShareToken(
                            JSON.parse(cv.data || "{}").publicToken || null
                          ); // Assuming publicToken is stored in data for now, or fetch it
                          setIsShareDialogOpen(true);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-green-50 text-green-600 transition-colors"
                        title={t("app.share")}
                      >
                        <Share2 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(cv.id, e)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                        title={t("app.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className="text-lg font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors"
                        title={cv.title}
                      >
                        {cv.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                      {cv.data
                        ? JSON.parse(cv.data).personalInfo?.summary ||
                          t("app.noSummary")
                        : t("app.noSummary")}
                    </p>

                    <div className="flex items-center text-xs text-gray-400 border-t pt-4 mt-auto">
                      <Clock size={14} className="mr-1" />
                      <span>
                        {t("app.updated")}{" "}
                        {new Date(
                          cv.updatedAt || cv.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New Card */}
            <div
              onClick={handleCreate}
              className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-80 animate-fade-in-up"
              style={{ animationDelay: "0ms" }}
            >
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors mb-4">
                <FileText className="text-blue-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
                {t("app.createCoverLetter")}
              </h3>
              <p className="text-sm text-gray-500 mt-2 text-center px-4">
                {t(
                  "app.createCoverLetterSubtitle",
                  "Write a tailored cover letter"
                )}
              </p>
            </div>

            {coverLetters &&
              coverLetters.map((cl, index) => (
                <div
                  key={cl.id}
                  onClick={() => navigate(`/cover-letter/${cl.id}`)}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-80 relative overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Preview Area */}
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative p-6 flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                    <div className="bg-white shadow-md w-32 h-40 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 flex flex-col overflow-hidden text-[5px]">
                      <CoverLetterPreview data={cl} />
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/cover-letter/${cl.id}`);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
                        title={t("app.edit")}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCoverLetter(cl.id!, e)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                        title={t("app.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className="text-lg font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors"
                        title={cl.title}
                      >
                        {cl.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                      {cl.jobTitle} {cl.company ? `at ${cl.company}` : ""}
                    </p>
                    <div className="flex items-center text-xs text-gray-400 border-t pt-4 mt-auto">
                      <Clock size={14} className="mr-1" />
                      <span>
                        {t("app.updated")}{" "}
                        {new Date(
                          cl.updatedAt || cl.createdAt || ""
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      <ShareCvDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        cvId={shareCvId || 0}
        initialPublicToken={shareToken}
        onShareChange={() => {
          // Optimistically update the local state if needed, or invalidate query
          // For now, simple reload or refetch would be best, but we'll just close
        }}
      />
    </div>
  );
}
