import { CoverLetterData } from "../../../types/coverLetter";

export default function CitrusCoverLetter({ data }: { data: CoverLetterData }) {
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans bg-white flex shadow-2xl mx-auto overflow-hidden text-gray-800">
      {/* Background Layer for Sidebar */}
      <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-yellow-400 z-0 print:bg-yellow-400 print:w-1/3" />

      {/* Sidebar */}
      <div className="w-1/3 p-8 flex flex-col gap-8 relative z-10 text-gray-800">
        <div className="mb-4">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Contact
          </h2>
          <div className="space-y-3 text-sm font-medium">
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.email && (
              <p className="break-all">{personalInfo.email}</p>
            )}
            {personalInfo.website && (
              <p className="break-all">{personalInfo.website}</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 pt-16 flex flex-col relative z-20">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              {personalInfo.fullName.split(" ")[0]}
            </h1>
            <h1 className="text-5xl font-light text-gray-600 mb-4">
              {personalInfo.fullName.split(" ").slice(1).join(" ")}
            </h1>
            <p className="text-xl text-gray-500 uppercase tracking-wide">
              {personalInfo.title}
            </p>
          </div>

          <div className="w-32 h-32 bg-gray-200 overflow-hidden border-4 border-yellow-400 shrink-0">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Photo
              </div>
            )}
          </div>
        </div>

        {/* Recipient / Date */}
        <div className="mb-10 flex justify-between items-end border-b-2 border-yellow-400 pb-4">
          <div className="space-y-1 text-sm text-gray-600">
            <p className="font-bold text-gray-900 text-base">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="font-medium text-gray-500">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
            {today}
          </div>
        </div>

        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <div className="mt-4 text-gray-800 font-signature text-3xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
