import RubyTemplate from "./templates/Ruby";
import AmberTemplate from "./templates/Amber";
import IronTemplate from "./templates/Iron";
import LagoonTemplate from "./templates/Lagoon";
import LimeTemplate from "./templates/Lime";
import ModernTemplate from "./templates/Modern";
import ClassicTemplate from "./templates/Classic";
import MinimalTemplate from "./templates/Minimal";
import NoirTemplate from "./templates/Noir";
import AzureTemplate from "./templates/Azure";
import SlateTemplate from "./templates/Slate";
import CitrusTemplate from "./templates/Citrus";
import MidnightTemplate from "./templates/Midnight";
import AuroraTemplate from "./templates/Aurora";
import AcademicTemplate from "./templates/Academic";
import PolygonalTemplate from "./templates/Polygonal";
import VerdeTemplate from "./templates/Verde";
import OrbitTemplate from "./templates/Orbit";
import { CvData, CvTheme } from "../types/cv";
import { useEffect, useRef, useState } from "react";

interface PreviewProps {
  cvData: CvData;
  template: string;
}

export default function Preview({ cvData, template }: PreviewProps) {
  const templates = {
    // Custom Templates (Dynamic Theme)
    "custom-modern": RubyTemplate,
    "custom-minimal": AmberTemplate,
    "custom-slate": IronTemplate,
    "custom-aurora": LagoonTemplate,
    "custom-citrus": LimeTemplate,

    // Standard Templates (Static)
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    noir: NoirTemplate,
    azure: AzureTemplate,
    slate: SlateTemplate,
    citrus: CitrusTemplate,
    midnight: MidnightTemplate,
    aurora: AuroraTemplate,
    academic: AcademicTemplate,
    polygonal: PolygonalTemplate,
    verde: VerdeTemplate,
    orbit: OrbitTemplate,
  };

  const TemplateComponent =
    templates[template as keyof typeof templates] || ModernTemplate;

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  // A4 dimensions in pixels (96 DPI)
  const A4_WIDTH_PX = 794;
  const A4_HEIGHT_PX = 1123;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const newScale = Math.min(1, (parentWidth - 4) / A4_WIDTH_PX);
        setScale(newScale);
      }
    };

    updateScale();

    const observer = new ResizeObserver(() => {
      updateScale();
    });

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Measurement effect to calculate pages
  useEffect(() => {
    if (!measureRef.current) return;

    const measureObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use scrollHeight to get the full content height including overflow
        const actualHeight = entry.target.scrollHeight;
        const newPageCount = Math.max(
          1,
          Math.ceil(actualHeight / A4_HEIGHT_PX)
        );

        setPageCount((prev) => {
          if (prev !== newPageCount) return newPageCount;
          return prev;
        });
      }
    });

    measureObserver.observe(measureRef.current);
    return () => measureObserver.disconnect();
  }, [template, cvData]); // Re-run if data changes to ensure observer is active on correct content

  const getThemeStyles = (theme?: CvTheme) => {
    return {
      "--primary-color": theme?.primaryColor || "#C85A54",
      "--font-family": theme?.fontFamily || "inherit",
      "--density":
        theme?.density === "compact"
          ? "0.75"
          : theme?.density === "spacious"
          ? "1.25"
          : "1",
    } as React.CSSProperties;
  };

  // Calculate quantized height for full-page background effect
  const quantizedHeight = pageCount * A4_HEIGHT_PX;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center lg:items-start min-h-full lg:min-h-0 bg-gray-200/50 overflow-hidden"
      style={{ padding: "0 2px" }}
    >
      {/* Hidden Measurement Container */}
      <div
        style={{
          width: "210mm",
          minWidth: "794px",
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          left: "-9999px",
          top: 0,
          ...getThemeStyles(cvData.theme),
        }}
      >
        <div ref={measureRef} className="bg-white relative">
          <TemplateComponent cvData={cvData} />
        </div>
      </div>

      {/* Visible Container */}
      <div
        style={{
          width: A4_WIDTH_PX * scale,
          height: quantizedHeight * scale,
          position: "relative",
          transition: "width 0.2s, height 0.2s",
        }}
        className="shadow-2xl my-4 lg:my-0 lg:mt-8 shrink-0 bg-white"
      >
        <div
          style={{
            ...getThemeStyles(cvData.theme),
            fontFamily: cvData.theme?.fontFamily || "inherit",
            width: "210mm",
            minWidth: "794px",
            height: `${quantizedHeight}px`,
            minHeight: `${quantizedHeight}px`,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            display: "flex",
            flexDirection: "column",
          }}
          className="bg-white origin-top-left relative"
        >
          {/* Wrap template in flex-1 to force expansion to minHeight */}
          <div className="flex-1 h-full w-full relative">
            <TemplateComponent cvData={cvData} />
          </div>

          {/* Page Break Visualizations */}
          {Array.from({ length: pageCount - 1 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 z-50 flex items-center justify-center pointer-events-none print:hidden"
              style={{
                top: `${(i + 1) * A4_HEIGHT_PX}px`,
                height: "40px",
                marginTop: "-20px",
                zIndex: 50,
              }}
            >
              <div className="w-full h-full relative">
                <div className="w-full border-t border-dashed border-red-400 absolute top-1/2 translate-y-[-0.5px] opacity-70"></div>
                <div className="absolute right-8 top-0 h-full flex flex-col justify-center items-end text-xs font-bold text-red-500 gap-1 leading-none opacity-80">
                  <span className="bg-white/90 px-1 rounded-sm shadow-sm translate-y-[2px]">
                    Page {i + 1}
                  </span>
                  <span className="bg-white/90 px-1 rounded-sm shadow-sm translate-y-[-2px]">
                    Page {i + 2}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
