import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Save } from "lucide-react";
import { useRenameCv } from "../hooks/useCv";
import { useRenameCoverLetter } from "../hooks/useCoverLetter";
import { useToast } from "../context/ToastContext";
import { Popup } from "./ui/Popup";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  currentTitle: string;
  type: "cv" | "coverLetter";
}

export function RenameDialog({
  isOpen,
  onClose,
  id,
  currentTitle,
  type,
}: RenameDialogProps) {
  const { t } = useTranslation();
  const [title, setTitle] = useState(currentTitle);
  const renameCvMutation = useRenameCv();
  const renameCoverLetterMutation = useRenameCoverLetter();
  const { showToast } = useToast();

  const isCv = type === "cv";
  const mutation = isCv ? renameCvMutation : renameCoverLetterMutation;

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim()) return;

    mutation.mutate(
      { id, title: title.trim() },
      {
        onSuccess: () => {
          showToast(
            t("app.toasts.renameSuccess", "Renamed successfully"),
            "success"
          );
          onClose();
        },
        onError: () => {
          showToast(t("app.toasts.renameError", "Failed to rename"), "error");
        },
      }
    );
  };

  const actions = (
    <>
      <Button type="button" onClick={onClose} variant="ghost" className="px-4">
        {t("app.cancel")}
      </Button>
      <Button
        onClick={() => handleSubmit()}
        variant="primary"
        className="px-6"
        icon={Save}
        disabled={mutation.isPending}
      >
        {t("app.save")}
      </Button>
    </>
  );

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={
        isCv
          ? t("app.dialogs.renameCvTitle", "Rename CV")
          : t("app.dialogs.renameCvTitle", "Rename Cover Letter")
      }
      actions={actions}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
      >
        <div className="mb-2">
          <label
            htmlFor="titleInput"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("app.labels.title", "Title")}
          </label>
          <input
            type="text"
            id="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder={t("app.placeholders.cvTitle", "Enter title")}
            autoFocus
          />
        </div>
      </form>
    </Popup>
  );
}
