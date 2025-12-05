import ModernTemplate from "./templates/Modern";
import ClassicTemplate from "./templates/Classic";
import MinimalTemplate from "./templates/Minimal";
import NoirTemplate from "./templates/Noir";
import AzureTemplate from "./templates/Azure";
import SlateTemplate from "./templates/Slate";
import CitrusTemplate from "./templates/Citrus";
import MidnightTemplate from "./templates/Midnight";
import { CvData } from "../types/cv";
import { useEffect, useRef, useState } from "react";

interface PreviewProps {
  cvData: CvData;
  template: string;
}

export default function Preview({ cvData, template }: PreviewProps) {
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    noir: NoirTemplate,
    azure: AzureTemplate,
    slate: SlateTemplate,
    citrus: CitrusTemplate,
    midnight: MidnightTemplate,
  };

  const TemplateComponent =
    templates[template as keyof typeof templates] || ModernTemplate;

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(1123); // Default A4 height ~1123px

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        const targetWidth = 794; // 210mm @ 96dpi
        // Use a minimal buffer (4px total)
        const newScale = Math.min(1, (parentWidth - 4) / targetWidth);
        setScale(newScale);
      }
    };

    // Initial scale
    updateScale();

    const observer = new ResizeObserver((entries) => {
      // Observe content height changes
      for (let entry of entries) {
        if (entry.target === contentRef.current) {
          setContentHeight(entry.contentRect.height);
        }
        if (entry.target === containerRef.current) {
          updateScale();
        }
      }
    });

    if (contentRef.current) observer.observe(contentRef.current);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Width of A4 in pixels
  const A4_WIDTH_PX = 794;

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center lg:items-start min-h-full lg:min-h-0 bg-gray-200/50 overflow-hidden"
      style={{ padding: "0 2px" }} // Tiny cosmetic padding
    >
      {/* 
                Wrapper that mimics the SCALED size. 
                Flexbox centers THIS element.
             */}
      <div
        style={{
          width: A4_WIDTH_PX * scale,
          height: contentHeight * scale,
          position: "relative",
          transition: "width 0.2s, height 0.2s", // Smooth resize
        }}
        className="shadow-2xl my-4 lg:my-0 lg:mt-8 shrink-0" // shrink-0 important for flex
      >
        {/* 
                    The actual content, scaled down and pinned to top-left of the wrapper 
                */}
        <div
          ref={contentRef}
          style={{
            width: "210mm",
            minWidth: "794px",
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
            height: "fit-content",
          }}
          className="bg-white origin-top-left"
        >
          <TemplateComponent cvData={cvData} />
        </div>
      </div>
    </div>
  );
}
