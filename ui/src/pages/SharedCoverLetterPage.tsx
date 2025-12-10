import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CoverLetterPreview from "../components/CoverLetterPreview";
import { coverLetterApi } from "../services/coverLetterApi";
import { CoverLetterData } from "../types/coverLetter";
import { Download, UserPlus } from "lucide-react";
import { config } from "../config";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function SharedCoverLetterPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<CoverLetterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchSharedCoverLetter = async () => {
      try {
        if (!token) return;
        const result = await coverLetterApi.getShared(token);
        setData(result);
      } catch (err) {
        console.error(err);
        setError(t("app.sharedCvNotFound")); // Reusing generic "not found" or similar key
      }
    };

    fetchSharedCoverLetter();
  }, [token, t]);

  const handleDownload = async () => {
    if (!data) return;

    setIsGeneratingPdf(true);
    try {
      const response = await fetch(
        `${config.apiUrl}/cover-letter/shared/${token}/pdf`
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${JSON.parse(data.data).fullName || "CoverLetter"}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t("sharedPage.coverLetterNotFound", "Cover Letter Not Found")}
          </h1>
          <p className="text-gray-600">
            {error ||
              t(
                "sharedPage.coverLetterNotFoundMessage",
                "The Cover Letter you are looking for does not exist or is no longer shared."
              )}
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header for actions */}
      <div className="bg-white shadow-sm p-4 print:hidden sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1
              className="text-xl font-bold text-gray-800 truncate max-w-xs"
              title={data.title}
            >
              {data.title}
            </h1>
            <span className="text-sm text-gray-500 hidden sm:inline">
              {t("sharedPage.by", {
                name: JSON.parse(data.data).fullName || "Unknown",
              })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button onClick={handleDownload} icon={Download} variant="primary">
              {t("sharedPage.downloadPdf", "Download PDF")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-grow p-4 md:p-8 overflow-auto print:p-0 print:overflow-visible">
        <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full">
          <CoverLetterPreview data={data} />
        </div>
      </div>

      {/* Floating Sign-up Message */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden animate-slide-in-right">
        <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-2xl flex flex-col gap-3 max-w-xs relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full shrink-0">
              <UserPlus className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                {t("sharedPage.marketing.title", "Build your own CV")}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {t(
                  "sharedPage.marketing.subtitleCL",
                  "Like this Cover Letter? Create your own professional resume in minutes for free."
                )}
              </p>
            </div>
          </div>
          <Link to="/register" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
              {t("sharedPage.marketing.button", "Get Started")}
            </Button>
          </Link>
          <button
            onClick={(e) => e.currentTarget.parentElement?.remove()}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            title={t("sharedPage.marketing.dismiss", "Dismiss")}
          >
            <span className="sr-only">Close</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* PDF Generation Loading Overlay */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
              <Download
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-600"
                size={24}
              />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {t("sharedPage.generating", "Generating PDF...")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("sharedPage.waitMessage", "This may take a few seconds")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
