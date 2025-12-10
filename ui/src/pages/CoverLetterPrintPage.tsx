import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { config } from "../config";
import { CoverLetterData } from "../types/coverLetter";
import CoverLetterPreview from "../components/CoverLetterPreview";

export default function CoverLetterPrintPage() {
  const { id } = useParams();
  const [data, setData] = useState<CoverLetterData | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch from the public /data endpoint
      fetch(`${config.apiUrl}/cover-letter/${id}/data`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then(setData)
        .catch(console.error);
    }
  }, [id]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="w-full h-screen bg-white flex justify-center items-start p-0 m-0 overflow-hidden">
      {/* Force specific width/height to match A4 if needed, or let content define it */}
      <div className="print:w-full print:h-full w-full h-full">
        <CoverLetterPreview data={data} />
      </div>
    </div>
  );
}
