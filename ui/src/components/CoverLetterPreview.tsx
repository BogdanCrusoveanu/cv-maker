import { CoverLetterData } from "../types/coverLetter";
import MidnightCoverLetter from "./cover-letters/MidnightCoverLetter";
import ModernCoverLetter from "./cover-letters/ModernCoverLetter";
import ClassicCoverLetter from "./cover-letters/ClassicCoverLetter";
import SlateCoverLetter from "./cover-letters/SlateCoverLetter";
import AzureCoverLetter from "./cover-letters/AzureCoverLetter";
import NoirCoverLetter from "./cover-letters/NoirCoverLetter";
import MinimalCoverLetter from "./cover-letters/MinimalCoverLetter";
import CitrusCoverLetter from "./cover-letters/CitrusCoverLetter";
import AuroraCoverLetter from "./cover-letters/AuroraCoverLetter";
import AcademicCoverLetter from "./cover-letters/AcademicCoverLetter";
import PolygonalCoverLetter from "./cover-letters/PolygonalCoverLetter";
import VerdeCoverLetter from "./cover-letters/VerdeCoverLetter";
import OrbitCoverLetter from "./cover-letters/OrbitCoverLetter";

export default function CoverLetterPreview({
  data,
}: {
  data: CoverLetterData;
}) {
  const template = data.template?.toLowerCase();

  switch (template) {
    case "modern":
      return <ModernCoverLetter data={data} />;
    case "classic":
      return <ClassicCoverLetter data={data} />;
    case "slate":
      return <SlateCoverLetter data={data} />;
    case "azure":
      return <AzureCoverLetter data={data} />;
    case "noir":
      return <NoirCoverLetter data={data} />;
    case "minimal":
      return <MinimalCoverLetter data={data} />;
    case "citrus":
      return <CitrusCoverLetter data={data} />;
    case "aurora":
      return <AuroraCoverLetter data={data} />;
    case "academic":
      return <AcademicCoverLetter data={data} />;
    case "polygonal":
      return <PolygonalCoverLetter data={data} />;
    case "verde":
      return <VerdeCoverLetter data={data} />;
    case "orbit":
      return <OrbitCoverLetter data={data} />;
    case "midnight":
    default:
      return <MidnightCoverLetter data={data} />;
  }
}
