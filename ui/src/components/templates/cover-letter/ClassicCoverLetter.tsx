import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { CoverLetterData } from "../../../types/coverLetter";

export default function ClassicCoverLetter({
  data,
}: {
  data: CoverLetterData;
}) {
  const content = JSON.parse(data.data || "{}");

  const personalInfo = {
    fullName: content.fullName || "Your Name",
    title: content.jobTitle || "Your Title",
    email: content.email || "your.email@example.com",
    phone: content.phone || "(555) 123-4567",
    address: content.address || "City, Country",
    website: content.website || "yourwebsite.com",
    photo: content.photoBase64 || null,
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // SVG wave patterns (copied from Classic.tsx)
  const WavePattern = () => (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "80px" }}
      >
        <path
          d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
          fill="#F4D35E"
        />
      </svg>
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "60px" }}
      >
        <path
          d="M0,45 C200,75 400,15 600,45 C800,75 1000,15 1200,45 L1200,120 L0,120 Z"
          fill="#F4A6C8"
        />
      </svg>
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "40px" }}
      >
        <path
          d="M0,30 C250,60 450,0 600,30 C750,60 950,0 1200,30 L1200,120 L0,120 Z"
          fill="#E5D4ED"
        />
      </svg>
    </div>
  );

  return (
    <div className="relative min-h-[29.7cm] w-[21cm] font-serif bg-white flex shadow-2xl mx-auto overflow-hidden">
      {/* Background Layer */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/3 z-0 print:bg-[#2C3E50]"
        style={{
          background:
            "linear-gradient(to bottom, #E5D4ED 0%, #E5D4ED 40%, #2C3E50 40%, #2C3E50 100%)",
        }}
      >
        <WavePattern />
      </div>

      {/* Sidebar */}
      <div className="w-1/3 relative z-10 p-8 flex flex-col">
        {/* Photo */}
        <div className="mb-8 flex justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 font-bold text-4xl">
                  {personalInfo.fullName.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-white flex flex-col gap-6 mt-32">
          {/* Added top margin to push contact info down to dark area if needed, 
                  or relied on background gradient. In Classic CV, gradient changes at 40%. 
                  We need to ensure text contrasts. 
                  Top part is #E5D4ED (light purple), bottom is #2C3E50 (dark blue). 
                  Let's assume photo area is in light, contact is in dark.
              */}

          <div className="flex items-start gap-3 text-white">
            <div className="bg-white/20 p-2 rounded shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Location</p>
              <p className="text-sm opacity-90">{personalInfo.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-white">
            <div className="bg-white/20 p-2 rounded shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Phone</p>
              <p className="text-sm opacity-90">{personalInfo.phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-white">
            <div className="bg-white/20 p-2 rounded shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-sm font-bold">Email</p>
              <p className="text-sm opacity-90 break-all">
                {personalInfo.email}
              </p>
            </div>
          </div>

          {personalInfo.website && (
            <div className="flex items-start gap-3 text-white">
              <div className="bg-white/20 p-2 rounded shrink-0">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Website</p>
                <p className="text-sm opacity-90 break-all">
                  {personalInfo.website}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-12 bg-white relative z-10 flex flex-col">
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 uppercase tracking-wide leading-tight">
            {personalInfo.fullName}
          </h1>
          <h2 className="text-2xl text-gray-500 uppercase tracking-widest">
            {personalInfo.title}
          </h2>
          <p className="text-gray-400 mt-4 font-medium">{today}</p>
        </div>

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-[#F4D35E]">
          <div className="text-sm space-y-1 text-gray-700">
            <p className="font-bold text-gray-900 text-lg">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="uppercase tracking-wider text-xs font-bold text-gray-500">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
        </div>

        <div className="flex-1 text-gray-800 leading-relaxed text-base whitespace-pre-wrap font-serif">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <p className="text-[#9B59B6] font-signature text-3xl mt-4 transform -rotate-2">
            {personalInfo.fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
