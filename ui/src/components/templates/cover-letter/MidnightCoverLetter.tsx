import { Phone, MapPin, Globe } from "lucide-react";
import { CoverLetterData } from "../../../types/coverLetter";
// import { useTranslation } from "react-i18next";

export default function MidnightCoverLetter({
  data,
}: {
  data: CoverLetterData;
}) {
  // const { t } = useTranslation();
  const content = JSON.parse(data.data || "{}");

  // Placeholder personal info (in a real app, this would come from a selected CV or Profile)
  const personalInfo = {
    fullName: content.fullName || "Your Name",
    title: content.jobTitle || "Your Title",
    email: content.email || "your.email@example.com",
    phone: content.phone || "(555) 123-4567",
    location: content.address || "City, Country",
    website: content.website || "yourwebsite.com",
    photo: content.photoBase64 || null,
  };

  const today = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans text-gray-100 bg-white flex shadow-2xl mx-auto overflow-hidden">
      {/* Sidebar - Dark Blue/Gray (1/3 width to match CV) */}
      <div className="w-1/3 bg-[#1f2937] p-8 flex flex-col items-center text-center border-r border-gray-700 relative z-10 print:bg-[#1f2937] print:w-1/3">
        {/* Photo Area */}
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-400 mb-6 shadow-xl shrink-0">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-xl">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-yellow-400 mb-2 uppercase tracking-wide">
          {personalInfo.fullName}
        </h1>
        <p className="text-gray-300 font-light mb-8 text-sm uppercase tracking-widest">
          {personalInfo.title}
        </p>

        {/* Contact Info */}
        <div className="w-full space-y-4 text-left border-t border-gray-600 pt-8">
          <h3 className="text-yellow-400 font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-sm">
            <span className="bg-yellow-400 text-gray-900 rounded-full p-1">
              <Phone size={10} />
            </span>{" "}
            Contact
          </h3>

          <div className="space-y-3 text-sm text-gray-300 pl-2 text-xs">
            <p className="flex items-center gap-2">
              <span className="w-4 flex justify-center">
                <Phone size={14} className="text-yellow-400" />
              </span>
              {personalInfo.phone}
            </p>
            <p className="flex items-center gap-2">
              <span className="w-4 flex justify-center">
                <Globe size={14} className="text-yellow-400" />
              </span>
              {personalInfo.email}
            </p>
            {personalInfo.location && (
              <p className="flex items-center gap-2">
                <span className="w-4 flex justify-center">
                  <MapPin size={14} className="text-yellow-400" />
                </span>
                {personalInfo.location}
              </p>
            )}
            {personalInfo.website && (
              <p className="flex items-center gap-2">
                <span className="w-4 flex justify-center">
                  <Globe size={14} className="text-yellow-400" />
                </span>
                {personalInfo.website}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content (2/3 width) */}
      <div className="w-2/3 p-12 text-gray-800 flex flex-col relative z-10 bg-white">
        {/* Header Section of Letter */}
        <div className="mb-12 border-b-2 border-yellow-400 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 uppercase tracking-tight">
                Cover Letter
              </h2>
              <p className="text-gray-500 mt-2 font-medium">{today}</p>
            </div>
          </div>

          {/* Recipient Block */}
          <div className="text-sm space-y-1 text-gray-600">
            <p className="font-bold text-gray-900 text-lg">
              {content.recipientName || "Recipient Name"}
            </p>
            <p>{content.recipientTitle || "Job Title"}</p>
            <p>{content.companyAddress || "Company Address"}</p>
            <p>{content.companyCityStateZip || "City, State, Zip"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        {/* Signature */}
        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <p className="text-yellow-600 font-signature text-2xl mt-4">
            {personalInfo.fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
