import { CoverLetterData } from "../../../types/coverLetter";

export default function VerdeCoverLetter({ data }: { data: CoverLetterData }) {
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans bg-white flex flex-col shadow-2xl mx-auto overflow-hidden text-gray-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-10 flex flex-col items-center text-center print:bg-emerald-600">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-24 h-24 rounded-full border-4 border-emerald-500 shadow-lg object-cover mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-2 tracking-wide">
          {personalInfo.fullName}
        </h1>
        <p className="text-xl font-light text-emerald-100 mb-6 uppercase tracking-widest">
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Content */}
      <div className="p-12 max-w-4xl mx-auto flex-1 flex flex-col w-full">
        <div className="flex justify-between items-start mb-12 border-b border-emerald-100 pb-6">
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-bold text-emerald-800 text-lg">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="font-medium text-emerald-600">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-sm font-bold text-gray-400">{today}</div>
        </div>

        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <div className="mt-4 text-emerald-600 font-signature text-3xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
