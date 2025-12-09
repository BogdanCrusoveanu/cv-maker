import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CvData, CvTheme } from "../types/cv";
import SlateTemplate from "../components/templates/Slate";
import ModernTemplate from "../components/templates/Modern";
import ClassicTemplate from "../components/templates/Classic";
import MinimalTemplate from "../components/templates/Minimal";
import NoirTemplate from "../components/templates/Noir";
import AzureTemplate from "../components/templates/Azure";
import CitrusTemplate from "../components/templates/Citrus";
import MidnightTemplate from "../components/templates/Midnight";
import AuroraTemplate from "../components/templates/Aurora";
import AcademicTemplate from "../components/templates/Academic";
import PolygonalTemplate from "../components/templates/Polygonal";
import VerdeTemplate from "../components/templates/Verde";
import OrbitTemplate from "../components/templates/Orbit";

// Custom Templates
import RubyTemplate from "../components/templates/Ruby";
import AmberTemplate from "../components/templates/Amber";
import IronTemplate from "../components/templates/Iron";
import LagoonTemplate from "../components/templates/Lagoon";
import LimeTemplate from "../components/templates/Lime";

// Default empty state to prevent crashes
const emptyCv: CvData = {
  personalInfo: {
    fullName: "Your Name",
    email: "",
    phone: "",
    location: "",
    website: "",
    title: "",
    summary: "",
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
  theme: {
    primaryColor: "#C85A54",
    fontFamily: "inherit",
    density: "normal",
  },
};

// Helper to deep merge
const mergeCvData = (base: CvData, incoming: any): CvData => {
  return {
    ...base,
    ...incoming,
    personalInfo: { ...base.personalInfo, ...(incoming.personalInfo || {}) },
    visibility: { ...base.visibility, ...(incoming.visibility || {}) },
    theme: { ...base.theme, ...(incoming.theme || {}) },
  };
};

// This page is used for headless PDF generation via Puppeteer
// It uses a public endpoint that doesn't require authentication
export default function PdfPage() {
  const { id } = useParams<{ id: string }>();
  const [cvData, setCvData] = useState<CvData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Height Quantization Logic for PDF
  // Must be declared BEFORE any early returns
  const [minHeight, setMinHeight] = useState("297mm");

  useEffect(() => {
    const fetchCv = async () => {
      try {
        // Direct fetch to backend to avoid proxy issues. CORS is enabled in Program.cs.
        const response = await fetch(`http://localhost:5140/api/cv/${id}/data`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch CV: ${response.status} ${response.statusText}`
          );
        }
        const data = await response.json();
        const parsedData = JSON.parse(data.data);

        // Merge with emptyCv to ensure structure exists
        const sanitizedData = mergeCvData(emptyCv, parsedData);

        setCvData(sanitizedData);
      } catch (err: any) {
        console.error("Error fetching CV:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCv();
    }
  }, [id]);

  useEffect(() => {
    // We need to measure the content and round up to the nearest A4 page height (1123px @ 96 DPI)
    // This ensures sidebars stretch to the bottom of the last page.
    const A4_HEIGHT_PX = 1123;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const height = entry.contentRect.height;
        if (height > 0) {
          const pages = Math.ceil(height / A4_HEIGHT_PX);
          const newMinHeight = `${pages * A4_HEIGHT_PX}px`;

          setMinHeight((prev) => {
            if (prev !== newMinHeight) {
              return newMinHeight;
            }
            return prev;
          });
        }
      }
    });

    // Observe the INNER content div
    const contentDiv = document.getElementById("pdf-content-inner");
    if (!loading && contentDiv) {
      observer.observe(contentDiv);
    }

    return () => observer.disconnect();
  }, [loading]); // Run when loading changes (finishes)

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

  const renderTemplate = () => {
    if (!cvData) return null;
    switch (cvData.template) {
      // Standard
      case "modern":
        return <ModernTemplate cvData={cvData} />;
      case "classic":
        return <ClassicTemplate cvData={cvData} />;
      case "minimal":
        return <MinimalTemplate cvData={cvData} />;
      case "noir":
        return <NoirTemplate cvData={cvData} />;
      case "azure":
        return <AzureTemplate cvData={cvData} />;
      case "citrus":
        return <CitrusTemplate cvData={cvData} />;
      case "midnight":
        return <MidnightTemplate cvData={cvData} />;
      case "aurora":
        return <AuroraTemplate cvData={cvData} />;
      case "academic":
        return <AcademicTemplate cvData={cvData} />;
      case "polygonal":
        return <PolygonalTemplate cvData={cvData} />;
      case "verde":
        return <VerdeTemplate cvData={cvData} />;
      case "orbit":
        return <OrbitTemplate cvData={cvData} />;

      // Custom
      case "custom-modern":
        return <RubyTemplate cvData={cvData} />;
      case "custom-minimal":
        return <AmberTemplate cvData={cvData} />;
      case "custom-slate":
        return <IronTemplate cvData={cvData} />;
      case "custom-aurora":
        return <LagoonTemplate cvData={cvData} />;
      case "custom-citrus":
        return <LimeTemplate cvData={cvData} />;

      case "slate":
      default:
        return <SlateTemplate cvData={cvData} />;
    }
  };

  if (loading) {
    // ...
  }

  if (error || !cvData) {
    return (
      <div className="flex items-center justify-center h-screen flex-col bg-white">
        <p className="text-red-600 font-bold text-xl mb-2">Failed to load CV</p>
        <div className="text-gray-600 font-mono text-sm bg-gray-100 p-4 rounded border border-gray-300 max-w-md break-all">
          {error || "No error details available."}
        </div>
        <p className="text-gray-400 text-xs mt-4">CvID: {id}</p>
      </div>
    );
  }

  return (
    <div
      className="w-[210mm] mx-auto bg-white"
      style={{
        ...getThemeStyles(cvData.theme),
        minHeight: minHeight,
        height: minHeight, // Ensure exact height for background stretching in PDF
      }}
    >
      {/* 
          Inner wrapper with id for observation. 
          Styles are inherited or applied here? 
          The templates expect to be directly in a container that has min-h-full?
          If we put min-h-full on inner, it looks at outer.
          Outer has explicit min-height.
       */}
      <div
        id="pdf-content-inner"
        className="w-full h-full relative"
        style={{
          fontFamily: cvData.theme?.fontFamily || "inherit",
          display: "grid",
        }}
      >
        {/* DEBUG MARKER */}
        {/* <div className="fixed top-0 left-0 bg-red-500 text-white p-2 z-[9999] opacity-50 pointer-events-none print:hidden">
            Rendered OK: {cvData.template} (ID: {id})
        </div> */}
        {renderTemplate()}
      </div>
    </div>
  );
}
