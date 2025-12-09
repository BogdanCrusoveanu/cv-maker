import { CoverLetterData } from "../../types/coverLetter";

export default function AcademicCoverLetter({
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

  return (
    <div className="relative min-h-[29.7cm] w-[21cm] font-serif bg-white flex flex-col shadow-2xl mx-auto overflow-hidden text-black leading-relaxed">
      <div className="p-12">
        {/* Header */}
        <div className="text-center border-b-2 border-black pb-6 mb-8">
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
            {personalInfo.fullName}
          </h1>
          <div className="flex justify-center flex-wrap gap-4 text-sm mt-2">
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </div>

        {/* Recipient & Date */}
        <div className="flex justify-between items-start mb-10">
          <div className="text-sm space-y-1">
            <p className="font-bold">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="italic">{content.recipientTitle || "Job Title"}</p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-sm">{today}</div>
        </div>

        <div className="flex-1 text-black leading-relaxed text-base whitespace-pre-wrap text-justify">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-16">
          <p className="text-black font-bold text-lg">Sincerely,</p>
          <div className="mt-6 mb-4 h-16">
            {/* Space for wet signature or digital one */}
            <p className="font-signature text-3xl">{personalInfo.fullName}</p>
          </div>
          <p className="border-t border-black pt-2 uppercase text-sm tracking-wide inline-block pr-10">
            {personalInfo.fullName}
          </p>
        </div>
      </div>
    </div>
  );
}
