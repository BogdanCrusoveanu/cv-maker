import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FileText,
  Building,
  User,
  Download,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { useTranslation } from "react-i18next";
import { coverLetterApi } from "../services/coverLetterApi";
import { CoverLetterData, CoverLetterContent } from "../types/coverLetter";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";
import { ChangePasswordDialog } from "./auth/ChangePasswordDialog";
import { Navbar } from "./layout/Navbar";
import CoverLetterPreview from "./CoverLetterPreview";
import { ShareDialog } from "./ShareDialog";
import { Share2 } from "lucide-react";

export default function CoverLetterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { logout, deleteAccount } = useAuth();
  const dialog = useDialog();

  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const [formData, setFormData] = useState<CoverLetterData>({
    title: "New Cover Letter",
    jobTitle: "",
    company: "",
    template: "midnight",
    data: JSON.stringify({
      recipientName: "",
      recipientTitle: "",
      companyAddress: "",
      companyCityStateZip: "",
      body: "",
    } as CoverLetterContent),
  });

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

  const handleCreate = () => {
    // Navigate to the list to create a new one, or reset form.
    // Navigating to /cover-letter w/o ID allows creating a new one.
    navigate("/cover-letter");
  };

  const content: CoverLetterContent = {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    // Ensure all fields have default values to prevent React "uncontrolled input" warnings
    // when switching between defined/undefined states.
    photoBase64: "",
    ...JSON.parse(formData.data || "{}"),
  };

  useEffect(() => {
    if (id) {
      loadCoverLetter(parseInt(id));
    }
  }, [id]);

  const loadCoverLetter = async (clId: number) => {
    try {
      setIsLoading(true);
      const data = await coverLetterApi.getById(clId);
      setFormData(data);
    } catch (error) {
      console.error(error);
      showToast(t("app.errorLoading"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = (field: keyof CoverLetterContent, value: string) => {
    const newContent = { ...content, [field]: value };
    setFormData({ ...formData, data: JSON.stringify(newContent) });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Ensure data string is up to date with content
      const updatedData = JSON.stringify(content);
      const dataToSave = { ...formData, data: updatedData };

      if (id) {
        await coverLetterApi.update(parseInt(id), dataToSave);
        showToast(t("app.toasts.saveSuccess"), "success");
      } else {
        const newCl = await coverLetterApi.create(dataToSave);
        navigate(`/cover-letter/${newCl.id}`);
        showToast(t("app.toasts.saveSuccess"), "success");
      }
    } catch (error) {
      console.error(error);
      showToast(t("app.toasts.saveError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxSize = 300; // Resize to max 300px

          if (width > height) {
            if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 0.8 quality
          const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
          updateContent("photoBase64", dataUrl);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadPdf = async () => {
    if (!id) {
      showToast(t("app.saveFirst"), "info"); // Or some message saying please save first
      return;
    }
    try {
      setIsDownloading(true);
      showToast(t("app.toasts.exportInfo"), "info");
      const blob = await coverLetterApi.downloadPdf(parseInt(id));
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Extract filename from formData or default
      const filename = `${formData.title || "cover-letter"}.pdf`;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("PDF downloaded successfully", "success");
    } catch (error) {
      console.error(error);
      showToast(t("app.toasts.saveError"), "error"); // Reuse save error or generic error
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <Navbar
        activeTab="coverLetters"
        onLogout={logout}
        onChangePassword={() => setIsPasswordDialogOpen(true)}
        onCreateCv={handleCreate}
        onDeleteAccount={handleDeleteAccount}
      />

      <ChangePasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
      />

      {/* Header Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="text-xl font-bold text-gray-900 leading-tight bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none transition-all px-1 -ml-1 w-full"
              placeholder={t("app.placeholders.cvTitle", "Cover Letter Title")}
            />
            <p className="text-gray-500 text-xs mt-0.5 ml-1">
              {t("app.targetJobTitle")}: {formData.jobTitle || "Not set"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              options={[
                { value: "midnight", label: "Midnight" },
                { value: "modern", label: "Modern" },
                { value: "classic", label: "Classic" },
                { value: "minimal", label: "Minimal" },
                { value: "noir", label: "Noir" },
                { value: "slate", label: "Slate" },
                { value: "azure", label: "Azure" },
                { value: "citrus", label: "Citrus" },
                { value: "aurora", label: "Aurora" },
                { value: "academic", label: "Academic" },
                { value: "polygonal", label: "Polygonal" },
                { value: "verde", label: "Verde" },
                { value: "orbit", label: "Orbit" },
              ]}
              value={formData.template || "midnight"}
              onChange={(e) =>
                setFormData({ ...formData, template: e.target.value })
              }
              placeholder="Select Template"
            />
          </div>
          {id && (
            <>
              <Button
                onClick={() => setIsShareDialogOpen(true)}
                variant="custom"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm rounded flex items-center gap-2"
                icon={Share2}
              >
                {t("editor.buttons.share")}
              </Button>
              <Button
                onClick={handleDownloadPdf}
                disabled={isDownloading || isLoading}
                variant="ghost"
                className="gap-2 border border-gray-300"
              >
                <Download size={18} />
                {isDownloading ? "Generating..." : t("app.downloadPdf")}
              </Button>
            </>
          )}
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save size={18} />
            {isLoading ? t("app.toasts.saveSuccess") : t("editor.buttons.save")}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Form */}
        <div className="w-1/3 min-w-[400px] bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6 space-y-8 pb-32">
            {/* Personal Details Group */}
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 flex items-center gap-2">
                <User size={16} />
                {t("app.personalDetails", "Personal Details")}
              </h2>
              <div className="space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center overflow-hidden shrink-0">
                    {content.photoBase64 ? (
                      <img
                        src={content.photoBase64}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("app.yourPhoto", "Your Photo")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </div>
                </div>

                <Input
                  label={t("app.yourName", "Your Name")}
                  value={content.fullName}
                  onChange={(e) => updateContent("fullName", e.target.value)}
                  placeholder="John Doe"
                />
                <Input
                  label={t("app.yourJobTitle", "Your Job Title")}
                  value={content.jobTitle}
                  onChange={(e) => updateContent("jobTitle", e.target.value)}
                  placeholder="Software Engineer"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("app.email")}
                    value={content.email}
                    onChange={(e) => updateContent("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                  <Input
                    label={t("app.phone")}
                    value={content.phone}
                    onChange={(e) => updateContent("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <Input
                  label={t("app.address", "Address / Location")}
                  value={content.address}
                  onChange={(e) => updateContent("address", e.target.value)}
                  placeholder="New York, NY"
                />
                <Input
                  label={t("app.website", "Website")}
                  value={content.website}
                  onChange={(e) => updateContent("website", e.target.value)}
                  placeholder="portfolio.com"
                />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Job Details Group */}
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 flex items-center gap-2">
                <Building size={16} />
                {t("app.jobDetails")}
              </h2>
              <div className="space-y-4">
                <Input
                  label={t("app.internalTitle")}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("app.targetJobTitle")}
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                    placeholder={t("app.placeholders.jobTitle")}
                  />
                  <Input
                    label={t("app.companyName")}
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    placeholder={t("app.placeholders.company")}
                  />
                </div>
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Recipient Group */}
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 flex items-center gap-2">
                <User size={16} />
                {t("app.recipientDetails")}
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t("app.recipientName")}
                    value={content.recipientName}
                    onChange={(e) =>
                      updateContent("recipientName", e.target.value)
                    }
                    placeholder={t("app.placeholders.recipientName")}
                  />
                  <Input
                    label={t("app.recipientTitle")}
                    value={content.recipientTitle}
                    onChange={(e) =>
                      updateContent("recipientTitle", e.target.value)
                    }
                    placeholder={t("app.placeholders.recipientTitle")}
                  />
                </div>
                <Input
                  label={t("app.companyAddress")}
                  value={content.companyAddress}
                  onChange={(e) =>
                    updateContent("companyAddress", e.target.value)
                  }
                  placeholder={t("app.placeholders.address")}
                />
                <Input
                  label={t("app.cityStateZip")}
                  value={content.companyCityStateZip}
                  onChange={(e) =>
                    updateContent("companyCityStateZip", e.target.value)
                  }
                  placeholder={t("app.placeholders.cityState")}
                />
              </div>
            </section>

            <hr className="border-gray-100" />

            {/* Body Content */}
            <section>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 font-bold mb-4 flex items-center gap-2">
                <FileText size={16} />
                {t("app.letterBody")}
              </h2>
              <textarea
                className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans text-sm leading-relaxed resize-none bg-gray-50"
                value={content.body}
                onChange={(e) => updateContent("body", e.target.value)}
                placeholder={t("app.placeholders.body")}
              />
            </section>
          </div>
        </div>

        {/* Right Details - Preview */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto flex justify-center items-start">
          <div className="origin-top transform scale-90 xl:scale-100 shadow-2xl transition-transform duration-200">
            <CoverLetterPreview data={formData} />
          </div>
        </div>
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        id={parseInt(id || "0")}
        initialPublicToken={formData.publicToken}
        onShareChange={(token) =>
          setFormData({ ...formData, publicToken: token })
        }
        type="coverLetter"
      />
    </div>
  );
}
