import { CoverLetterData } from "../types/coverLetter";
import MidnightCoverLetter from "./templates/cover-letter/MidnightCoverLetter";
import ModernCoverLetter from "./templates/cover-letter/ModernCoverLetter";
import ClassicCoverLetter from "./templates/cover-letter/ClassicCoverLetter";
import SlateCoverLetter from "./templates/cover-letter/SlateCoverLetter";
import AzureCoverLetter from "./templates/cover-letter/AzureCoverLetter";
import NoirCoverLetter from "./templates/cover-letter/NoirCoverLetter";
import MinimalCoverLetter from "./templates/cover-letter/MinimalCoverLetter";
import CitrusCoverLetter from "./templates/cover-letter/CitrusCoverLetter";
import AuroraCoverLetter from "./templates/cover-letter/AuroraCoverLetter";
import AcademicCoverLetter from "./templates/cover-letter/AcademicCoverLetter";
import PolygonalCoverLetter from "./templates/cover-letter/PolygonalCoverLetter";
import VerdeCoverLetter from "./templates/cover-letter/VerdeCoverLetter";
import OrbitCoverLetter from "./templates/cover-letter/OrbitCoverLetter";

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
