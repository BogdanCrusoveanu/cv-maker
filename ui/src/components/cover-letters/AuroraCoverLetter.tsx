import { CoverLetterData } from "../../types/coverLetter";

export default function AuroraCoverLetter({ data }: { data: CoverLetterData }) {
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
      <header className="bg-teal-700 text-white p-10 print:bg-teal-700">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-wide uppercase mb-2">
              {personalInfo.fullName}
            </h1>
            <p className="text-xl opacity-90">{personalInfo.title}</p>
          </div>
          <div>
            {personalInfo.photo && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md">
                <img
                  src={personalInfo.photo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm opacity-80 mt-6 pt-6 border-t border-teal-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span>📧</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span>📱</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-12">
        <div className="flex justify-between items-start mb-10">
          <div className="text-sm space-y-1 text-gray-700">
            <p className="font-bold text-teal-800 text-lg">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="font-semibold text-gray-600">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-sm text-gray-500 font-medium">{today}</div>
        </div>

        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <div className="mt-4 text-teal-700 font-signature text-3xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
