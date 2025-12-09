import { Palette, Type, Layout } from "lucide-react";
import { CvData, CvTheme } from "../types/cv";
import { useTranslation } from "react-i18next";

interface ThemeEditorProps {
  cvData: CvData;
  setCvData: (data: CvData) => void;
}

const PRESET_COLORS = [
  "#111827", // Black
  "#EF4444", // Red
  "#EA580C", // Orange
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#64748B", // Slate
  "#84cc16", // Lime
];

const FONTS = [
  { name: "Roboto", value: "'Roboto', sans-serif" },
  { name: "Open Sans", value: "'Open Sans', sans-serif" },
  { name: "Merriweather", value: "'Merriweather', serif" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Montserrat", value: "'Montserrat', sans-serif" },
  { name: "Lato", value: "'Lato', sans-serif" },
  { name: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
  { name: "Nunito", value: "'Nunito', sans-serif" },
];

export function ThemeEditor({ cvData, setCvData }: ThemeEditorProps) {
  const { t } = useTranslation();
  const theme = cvData.theme || {};

  const updateTheme = (key: keyof CvTheme, value: any) => {
    setCvData({
      ...cvData,
      theme: {
        ...theme,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <section className="space-y-3">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Palette size={18} />
          {t("editor.theme.accentColor")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => updateTheme("primaryColor", color)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                theme.primaryColor === color
                  ? "border-gray-900 scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            />
          ))}
          <div className="relative">
            <input
              type="color"
              value={theme.primaryColor || "#3B82F6"}
              onChange={(e) => updateTheme("primaryColor", e.target.value)}
              className="w-8 h-8 rounded-full overflow-hidden cursor-pointer opacity-0 absolute inset-0 z-10"
            />
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white"
              title="Custom Color"
            >
              <span className="w-full h-full rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500 opacity-50"></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{t("editor.theme.current")}:</span>
          <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
            {theme.primaryColor || t("editor.theme.default")}
          </span>
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-3">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Type size={18} />
          {t("editor.theme.typography")}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => (
            <button
              key={font.name}
              onClick={() => updateTheme("fontFamily", font.value)}
              className={`px-3 py-2 text-sm border rounded text-left transition-colors ${
                theme.fontFamily === font.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              style={{ fontFamily: font.value }}
            >
              {font.name}
            </button>
          ))}
        </div>
      </section>

      {/* Density */}
      <section className="space-y-3">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Layout size={18} />
          {t("editor.theme.spacingDensity")}
        </h3>
        <div className="flex rounded-lg border border-gray-200 p-1 bg-gray-50">
          {(["compact", "normal", "spacious"] as const).map((density) => (
            <button
              key={density}
              onClick={() => updateTheme("density", density)}
              className={`flex-1 py-1.5 text-sm font-medium rounded capitalize transition-all ${
                (theme.density || "normal") === density
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t(`editor.theme.density.${density}`)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
