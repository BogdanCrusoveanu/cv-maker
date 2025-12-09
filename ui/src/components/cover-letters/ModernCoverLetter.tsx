import { CoverLetterData } from "../../types/coverLetter";

export default function ModernCoverLetter({ data }: { data: CoverLetterData }) {
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

  const getInitials = (name: string) => {
    if (!name) return "YN";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative min-h-[29.7cm] w-[21cm] font-serif bg-white flex shadow-2xl mx-auto overflow-hidden">
      {/* Background Layer for Sidebar */}
      <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#C85A54] z-0 print:bg-[#C85A54] print:w-1/3" />

      {/* Sidebar - Terracotta Red */}
      <div className="w-1/3 text-white p-8 flex flex-col gap-6 relative z-10">
        {/* Photo or Initials Box */}
        <div className="bg-white flex items-center justify-center shrink-0 w-full aspect-square max-w-[200px] mx-auto">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#C85A54] text-5xl font-bold">
              {getInitials(personalInfo.fullName)}
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-6 mt-4">
          {personalInfo.address && (
            <div>
              <h3 className="font-bold text-lg mb-1">Location</h3>
              <p className="text-sm">{personalInfo.address}</p>
              <div className="h-px bg-white/30 mt-2"></div>
            </div>
          )}

          {personalInfo.phone && (
            <div>
              <h3 className="font-bold text-lg mb-1">Phone</h3>
              <p className="text-sm">{personalInfo.phone}</p>
              <div className="h-px bg-white/30 mt-2"></div>
            </div>
          )}

          {personalInfo.email && (
            <div>
              <h3 className="font-bold text-lg mb-1">Email</h3>
              <p className="text-sm break-all">{personalInfo.email}</p>
              <div className="h-px bg-white/30 mt-2"></div>
            </div>
          )}

          {personalInfo.website && (
            <div>
              <h3 className="font-bold text-lg mb-1">Website</h3>
              <p className="text-sm break-words">{personalInfo.website}</p>
              <div className="h-px bg-white/30 mt-2"></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-12 bg-gray-50 flex flex-col relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.fullName}
          </h1>
          <h2 className="text-xl font-medium text-[#C85A54] mb-8">
            {personalInfo.title}
          </h2>
          <p className="text-gray-500 font-medium">{today}</p>
        </div>

        <div className="mb-8">
          <div className="text-sm space-y-1 text-gray-700">
            <p className="font-bold text-gray-900 text-base">
              {content.recipientName || "Recipient Name"}
            </p>
            <p>{content.recipientTitle || "Job Title"}</p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-sans">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        {/* Signature */}
        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <p className="text-[#C85A54] font-signature text-2xl mt-4">
            {personalInfo.fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
