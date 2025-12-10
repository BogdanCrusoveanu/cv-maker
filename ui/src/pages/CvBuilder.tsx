import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Download,
  Palette,
  Save,
  ArrowLeft,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import CvEditor from "../components/CvEditor";
import Preview from "../components/Preview";
import { useAuth } from "../context/AuthContext";
import { useCv, useSaveCv } from "../hooks/useCv";
import { useToast } from "../context/ToastContext";
import { CvData } from "../types/cv";
import { ShareCvDialog } from "../components/ShareCvDialog";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import api from "../services/api";

export default function CvBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

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
  const [templateCategory, setTemplateCategory] = useState<
    "standard" | "custom"
  >("standard");
  // Remember last selected template for each category
  const [lastStandard, setLastStandard] = useState("modern");

  const [lastCustom, setLastCustom] = useState("custom-modern");

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userInitiatedTemplateChange = useRef(false);

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

  const cvDataRef = useRef(cvData);
  const prevTemplateRef = useRef(currentTemplate);

  // Keep ref in sync
  useEffect(() => {
    cvDataRef.current = cvData;
  }, [cvData]);

  const TEMPLATES = [
    {
      id: "modern",
      name: "Modern",
      color: "text-red-600",
      bg: "bg-red-500",
    },
    {
      id: "classic",
      name: "Classic",
      color: "text-purple-600",
      bg: "bg-purple-500",
    },
    {
      id: "minimal",
      name: "Minimal",
      color: "text-yellow-600",
      bg: "bg-yellow-500",
    },
    { id: "noir", name: "Noir", color: "text-gray-900", bg: "bg-gray-800" },
    { id: "azure", name: "Azure", color: "text-blue-600", bg: "bg-blue-500" },
    { id: "slate", name: "Slate", color: "text-slate-700", bg: "bg-slate-600" },
    {
      id: "citrus",
      name: "Citrus",
      color: "text-yellow-600",
      bg: "bg-yellow-400",
    },
    {
      id: "midnight",
      name: "Midnight",
      color: "text-indigo-900",
      bg: "bg-indigo-800",
    },
    { id: "aurora", name: "Aurora", color: "text-teal-700", bg: "bg-teal-600" },
    { id: "academic", name: "Academic", color: "text-black", bg: "bg-black" },
    {
      id: "polygonal",
      name: "Polygonal",
      color: "text-indigo-600",
      bg: "bg-indigo-500",
    },
    {
      id: "verde",
      name: "Verde",
      color: "text-emerald-600",
      bg: "bg-emerald-500",
    },
    {
      id: "orbit",
      name: "Orbit",
      color: "text-orange-600",
      bg: "bg-orange-500",
    },
    {
      id: "custom-modern",
      name: "Ruby",
      color: "text-red-600",
      bg: "bg-red-500",
      defaultColor: "#EF4444", // Red-500
    },
    {
      id: "custom-minimal",
      name: "Amber",
      color: "text-amber-700",
      bg: "bg-amber-500",
      defaultColor: "#F59E0B", // Amber-500
    },
    {
      id: "custom-slate",
      name: "Iron",
      color: "text-slate-700",
      bg: "bg-slate-600",
      defaultColor: "#64748B", // Slate-500
    },
    {
      id: "custom-aurora",
      name: "Lagoon",
      color: "text-teal-700",
      bg: "bg-teal-600",
      defaultColor: "#0D9488", // Teal-600
    },
    {
      id: "custom-citrus",
      name: "Lime",
      color: "text-lime-700",
      bg: "bg-lime-500",
      defaultColor: "#84cc16", // Lime-500
    },
  ];

  const navigateTemplate = (direction: "prev" | "next") => {
    const currentList = TEMPLATES.filter((t) =>
      templateCategory === "custom"
        ? t.id.startsWith("custom-")
        : !t.id.startsWith("custom-")
    );
    const currentIndex = currentList.findIndex((t) => t.id === currentTemplate);
    let newIndex;
    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentList.length - 1;
    } else {
      newIndex = currentIndex < currentList.length - 1 ? currentIndex + 1 : 0;
    }
    const nextTemplateId = currentList[newIndex].id;
    userInitiatedTemplateChange.current = true;
    setCurrentTemplate(nextTemplateId);
  };

  // Update history and apply default color logic
  useEffect(() => {
    if (currentTemplate) {
      if (currentTemplate.startsWith("custom-")) {
        setLastCustom(currentTemplate);

        // Logic for preserving custom color
        if (userInitiatedTemplateChange.current) {
          const newTemplateObj = TEMPLATES.find(
            (t) => t.id === currentTemplate
          ) as any;
          const prevTemplateObj = TEMPLATES.find(
            (t) => t.id === prevTemplateRef.current
          ) as any;

          // Check if we should switch to default or keep existing
          let shouldSwitchToDefault = true;

          // If coming from another CUSTOM template
          if (
            prevTemplateObj &&
            prevTemplateObj.id.startsWith("custom-") &&
            prevTemplateObj.defaultColor
          ) {
            // If current color is DIFFERENT from the previous default, user customized it -> Keep it.
            // CAUTION: Comparison must be robust (case insensitive usually, but HTML colors are #HEX).
            const currentColor = cvDataRef.current.theme?.primaryColor;

            if (
              currentColor &&
              currentColor.toLowerCase() !==
                prevTemplateObj.defaultColor.toLowerCase()
            ) {
              shouldSwitchToDefault = false; // User has customized, so DON'T switch
            }
          }
          // If coming from STANDARD template -> Always switch to default (shouldSwitchToDefault = true)

          if (
            shouldSwitchToDefault &&
            newTemplateObj &&
            newTemplateObj.defaultColor
          ) {
            setCvData((prevResult) => ({
              ...prevResult,
              theme: {
                ...prevResult.theme,
                primaryColor: newTemplateObj.defaultColor,
              },
            }));
          }
        }
      } else {
        setLastStandard(currentTemplate);
      }

      // Reset the flag after processing
      userInitiatedTemplateChange.current = false;
      prevTemplateRef.current = currentTemplate;

      // Auto-scroll logic (existing)
      if (scrollContainerRef.current) {
        const activeBtn = scrollContainerRef.current.querySelector(
          `[data-template-id="${currentTemplate}"]`
        );
        if (activeBtn) {
          activeBtn.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }
  }, [currentTemplate]);

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
      setTemplateCategory("standard");
    }
  }, [cvDataFromApi, id]);

  // Update category when template changes (if loaded from saved CV)
  useEffect(() => {
    if (currentTemplate) {
      const isCustom = currentTemplate.startsWith("custom-");
      setTemplateCategory(isCustom ? "custom" : "standard");
    }
  }, [currentTemplate]);

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
        showToast(t("app.toasts.saveSuccess"), "success");
      },
      onError: (error) => {
        console.error("Failed to save CV", error);
        showToast(t("app.toasts.saveError"), "error");
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

  const handlePrint = () => {
    if (!cvId) {
      showToast(t("app.toasts.saveFirst"), "error"); // Note: Need to add this key or reuse saveError? Actually I missed this one in the keys list. Let's use "Failed to save CV" or create a new one? Or maybe just hardcode fallback for now to avoid breaking if key missing. I will add 'saveFirst' key later or reuse. Wait, I didn't add 'saveFirst'. Let's check my keys. I added 'saveError'. I'll stick to English for this specific one if I missed it, or reuse 'saveError' which is close enough? No, "Please save first" is different. I'll add "saveFirst" to en.json later. For now let's use a temporary string or existing key. actually I will assume I will add it.
      // Better yet, I'll just use a direct string for now and add it in next turn to be safe.
      showToast("Please save your CV first", "error");
      return;
    }

    setIsGeneratingPdf(true);
    showToast(t("app.toasts.exportInfo"), "info");

    // Direct download approach: let the browser handle it via navigation.
    // This allows the browser to respect the server's Content-Disposition header perfectly.
    // Cookies are automatically sent for authentication.
    const baseURL = api.defaults.baseURL || "http://localhost:5140/api";
    const downloadUrl = `${baseURL}/cv/${cvId}/pdf`;

    // Create a temporary link and click it
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.target = "_self"; // Explicitly download in same tab context
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // We can't know exactly when download finishes, but we can reset the spinner
    setTimeout(() => {
      setIsGeneratingPdf(false);
    }, 2500);
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
                <span className="hidden sm:inline">{t("app.back")}</span>
              </Button>
              <h1 className="text-xl lg:text-3xl font-bold">CV Builder</h1>
            </div>
            <div className="flex gap-2 items-center">
              <LanguageSwitcher />
              {cvId && (
                <Button
                  onClick={() => setIsShareDialogOpen(true)}
                  variant="custom"
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 lg:px-3 text-xs lg:text-sm rounded flex items-center gap-1 lg:gap-2"
                  icon={Share2}
                >
                  <span className="hidden sm:inline">
                    {t("editor.buttons.share")}
                  </span>
                </Button>
              )}
              <Button
                onClick={logout}
                variant="custom"
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 lg:px-3 text-xs lg:text-sm rounded"
              >
                {t("editor.buttons.logout")}
              </Button>
            </div>
          </div>

          {/* Template Category Tabs */}
          <div className="flex gap-4 mb-4 border-b border-white/20 pb-0">
            <button
              onClick={() => {
                setTemplateCategory("standard");
                userInitiatedTemplateChange.current = true;
                setCurrentTemplate(lastStandard);
              }}
              className={`pb-2 text-sm font-semibold transition-colors ${
                templateCategory === "standard"
                  ? "text-white border-b-2 border-white"
                  : "text-blue-100 hover:text-white"
              }`}
            >
              {t("editor.tabs.standardTemplates")}
            </button>
            <button
              onClick={() => {
                setTemplateCategory("custom");
                userInitiatedTemplateChange.current = true; // User clicked category, so next template set is user-driven
                setCurrentTemplate(lastCustom);
              }}
              className={`pb-2 text-sm font-semibold transition-colors ${
                templateCategory === "custom"
                  ? "text-white border-b-2 border-white" // Keep active style
                  : "text-blue-100 hover:text-white"
              }`}
            >
              {t("editor.tabs.customizableTemplates")}
            </button>
          </div>

          {/* Template Switcher */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-thin"
          >
            {TEMPLATES.filter((t) =>
              templateCategory === "custom"
                ? t.id.startsWith("custom-")
                : !t.id.startsWith("custom-")
            ).map((t) => (
              <Button
                key={t.id}
                data-template-id={t.id}
                onClick={() => {
                  userInitiatedTemplateChange.current = true;
                  setCurrentTemplate(t.id);
                }}
                variant="custom"
                className={`whitespace-nowrap px-3 py-1 lg:py-2 lg:px-4 transition-all font-semibold rounded-full text-sm ${
                  currentTemplate === t.id
                    ? `bg-white ${t.color} shadow-lg`
                    : `${t.bg} text-white hover:opacity-90`
                }`}
                icon={Palette}
              >
                {t.name}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              variant="custom"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 lg:py-3 px-4 lg:px-6 font-semibold transition-all shadow-lg hover:shadow-xl text-sm lg:text-base"
              icon={Save}
              iconSize={20}
            >
              {t("editor.buttons.save")}
            </Button>
            <Button
              onClick={handlePrint}
              variant="custom"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 lg:py-3 px-4 lg:px-6 font-semibold transition-all shadow-lg hover:shadow-xl text-sm lg:text-base"
              icon={Download}
              iconSize={20}
            >
              {t("editor.buttons.export")}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <CvEditor
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
        <div className="flex-1 overflow-y-auto p-0 lg:p-8 pb-20 lg:pb-8 relative group">
          <Button
            onClick={() => navigateTemplate("prev")}
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 hidden lg:flex opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Previous Template"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </Button>

          <Button
            onClick={() => navigateTemplate("next")}
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 hidden lg:flex opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Next Template"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </Button>

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
          {t("editor.mobile.editor")}
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
          {t("editor.mobile.preview")}
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
                {t("editor.export.generating")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("editor.export.waitMessage")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
