import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, Palette, Save, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import Editor from "../components/Editor";
import Preview from "../components/Preview";
import { useAuth } from "../context/AuthContext";
import { useCv, useSaveCv } from "../hooks/useCv";
import { useToast } from "../context/ToastContext";
import { CvData } from "../types/cv";
import { ShareCvDialog } from "../components/ShareCvDialog";
import api from "../services/api";

export default function CvBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  // Fetch specific CV if ID exists, otherwise null
  const { data: cvDataFromApi, isLoading, isError } = useCv(id);
  const saveCvMutation = useSaveCv();

  const [currentTemplate, setCurrentTemplate] = useState("modern");
  const [cvId, setCvId] = useState<number | undefined>(
    id ? parseInt(id) : undefined
  );
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");

  // Initial empty state
  const emptyCv: CvData = {
    personalInfo: {
      fullName: "Your Name",
      email: "email@example.com",
      phone: "",
      location: "",
      website: "",
      title: "Professional Title",
      summary: "Professional summary...",
      photo: "",
      customFields: [],
    },
    experience: [],
    education: [],
    skills: [],
    interests: [],
    languages: [],
    customSections: [],
    visibility: {
      experience: true,
      education: true,
      skills: true,
      interests: true,
      languages: true,
      customSections: true,
      personalInfo: true,
      summary: true,
    },
  };

  const [cvData, setCvData] = useState<CvData>(emptyCv);

  // Update state when data is fetched
  useEffect(() => {
    if (cvDataFromApi) {
      setCvId(cvDataFromApi.id);
      if (cvDataFromApi.data) {
        try {
          const parsedData = JSON.parse(cvDataFromApi.data);
          setCvData(parsedData);
          if (parsedData.template) {
            setCurrentTemplate(parsedData.template);
          }
        } catch (e) {
          console.error("Error parsing CV data", e);
        }
      }
    } else if (!id) {
      // Reset if creating new
      setCvData(emptyCv);
      setCvId(undefined);
      setCurrentTemplate("modern");
    }
  }, [cvDataFromApi, id]);

  const handleSave = () => {
    const cvToSave: CvData = {
      ...cvData,
      id: cvId,
      title: cvData.personalInfo.fullName + "'s CV",
      template: currentTemplate,
    };

    saveCvMutation.mutate(cvToSave, {
      onSuccess: (data) => {
        setCvId(data.id);
        showToast("CV Saved!", "success");
      },
      onError: (error) => {
        console.error("Failed to save CV", error);
        showToast("Failed to save CV", "error");
      },
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading CV
      </div>
    );

  const handlePrint = async () => {
    if (!cvId) {
      showToast("Please save your CV first", "error");
      return;
    }

    setIsGeneratingPdf(true);
    try {
      // Use api.get (axios) to handle auth/cookies/refresh automatically
      const response = await api.get(`/cv/${cvId}/pdf`, {
        responseType: "blob",
      });

      const blob = response.data;
      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Ensure filename ends with .pdf
      let filename = (cvData.personalInfo.fullName || "CV").trim();
      filename = filename.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
      if (!filename.toLowerCase().endsWith(".pdf")) {
        filename += ".pdf";
      }

      // Create and trigger download link
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();

      // Cleanup after download starts
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }, 250);

      showToast("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showToast("Failed to generate PDF", "error");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Editor Side */}
      <div
        className={`w-full lg:w-1/2 flex flex-col h-full bg-white shadow-lg no-print ${
          mobileTab === "preview" ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 lg:p-6 shadow-md shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 lg:gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="ghost"
                className="text-white hover:text-gray-200 hover:bg-white/10 p-2"
                icon={ArrowLeft}
              >
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-xl lg:text-3xl font-bold">CV Builder</h1>
            </div>
            <div className="flex gap-2 items-center">
              {cvId && (
                <Button
                  onClick={() => setIsShareDialogOpen(true)}
                  variant="custom"
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 lg:px-3 text-xs lg:text-sm rounded flex items-center gap-1 lg:gap-2"
                  icon={Share2}
                >
                  <span className="hidden sm:inline">Share</span>
                </Button>
              )}
              <Button
                onClick={logout}
                variant="custom"
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 lg:px-3 text-xs lg:text-sm rounded"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Template Switcher */}
          <div className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-thin">
            <Button
              onClick={() => setCurrentTemplate("modern")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "modern"
                  ? "bg-white text-red-600 shadow-lg"
                  : "bg-red-500 text-white hover:bg-red-400"
              }`}
              icon={Palette}
            >
              Red Accent
            </Button>
            <Button
              onClick={() => setCurrentTemplate("classic")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "classic"
                  ? "bg-white text-purple-600 shadow-lg"
                  : "bg-purple-500 text-white hover:bg-purple-400"
              }`}
              icon={Palette}
            >
              Purple Wave
            </Button>
            <Button
              onClick={() => setCurrentTemplate("minimal")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "minimal"
                  ? "bg-white text-yellow-600 shadow-lg"
                  : "bg-yellow-500 text-white hover:bg-yellow-400"
              }`}
              icon={Palette}
            >
              Yellow Bold
            </Button>
            <Button
              onClick={() => setCurrentTemplate("noir")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "noir"
                  ? "bg-white text-gray-900 shadow-lg"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
              icon={Palette}
            >
              Noir
            </Button>
            <Button
              onClick={() => setCurrentTemplate("azure")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "azure"
                  ? "bg-white text-blue-600 shadow-lg"
                  : "bg-blue-500 text-white hover:bg-blue-400"
              }`}
              icon={Palette}
            >
              Azure
            </Button>
            <Button
              onClick={() => setCurrentTemplate("slate")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "slate"
                  ? "bg-white text-slate-700 shadow-lg"
                  : "bg-slate-600 text-white hover:bg-slate-500"
              }`}
              icon={Palette}
            >
              Slate
            </Button>
            <Button
              onClick={() => setCurrentTemplate("citrus")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "citrus"
                  ? "bg-white text-yellow-600 shadow-lg"
                  : "bg-yellow-400 text-white hover:bg-yellow-300"
              }`}
              icon={Palette}
            >
              Citrus
            </Button>
            <Button
              onClick={() => setCurrentTemplate("midnight")}
              variant="custom"
              className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                currentTemplate === "midnight"
                  ? "bg-white text-indigo-900 shadow-lg"
                  : "bg-indigo-800 text-white hover:bg-indigo-700"
              }`}
              icon={Palette}
            >
              Midnight
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="custom"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 lg:py-3 px-4 lg:px-6 font-semibold transition-all shadow-lg hover:shadow-xl text-sm lg:text-base"
              icon={Save}
              iconSize={20}
            >
              Save
            </Button>
            <Button
              onClick={handlePrint}
              variant="custom"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 lg:py-3 px-4 lg:px-6 font-semibold transition-all shadow-lg hover:shadow-xl text-sm lg:text-base"
              icon={Download}
              iconSize={20}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Editor
            cvData={cvData}
            setCvData={setCvData}
            currentTemplate={currentTemplate}
          />
        </div>
      </div>

      {/* Preview Side - Full Width on Print */}
      <div
        className={`w-full lg:w-1/2 bg-gray-200 h-full overflow-hidden flex flex-col print-full ${
          mobileTab === "editor" ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-0 lg:p-8 pb-20 lg:pb-8">
          <Preview cvData={cvData} template={currentTemplate} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 flex shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-4 font-bold text-center transition-colors ${
            mobileTab === "editor"
              ? "text-blue-600 bg-blue-50 border-t-2 border-blue-600"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Editor
        </button>
        <div className="w-px bg-gray-200"></div>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-4 font-bold text-center transition-colors ${
            mobileTab === "preview"
              ? "text-blue-600 bg-blue-50 border-t-2 border-blue-600"
              : "text-gray-500 hover:bg-gray-50"
          }`}
        >
          Preview
        </button>
      </div>

      <ShareCvDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        cvId={cvId || 0}
        initialPublicToken={cvDataFromApi?.publicToken}
        onShareChange={() => {}}
      />

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
                Generating PDF...
              </h3>
              <p className="text-sm text-gray-600">
                This may take a few seconds
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
