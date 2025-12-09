import { CoverLetterData } from "../../types/coverLetter";

export default function PolygonalCoverLetter({
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans bg-slate-50 flex shadow-2xl mx-auto overflow-hidden text-gray-800">
      {/* Background Polygon Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 z-0"></div>
      </div>

      {/* Sidebar */}
      <div className="w-[35%] bg-slate-900 text-white p-8 relative z-10 flex flex-col print:bg-slate-900">
        {/* Background for Print */}
        <div className="absolute top-0 bottom-0 left-0 w-full bg-slate-900 z-[-1] print:block hidden" />

        <div className="mb-10 text-center">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-700 shadow-xl"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mx-auto shadow-xl text-3xl font-bold">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="space-y-4 text-sm opacity-90">
          {personalInfo.email && (
            <div className="flex flex-col">
              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                Email
              </span>
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex flex-col">
              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                Phone
              </span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex flex-col">
              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                Location
              </span>
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex flex-col">
              <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                Website
              </span>
              <span className="break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[65%] p-10 flex flex-col relative z-20 bg-white/80 backdrop-blur-sm">
        <div className="border-l-4 border-indigo-500 pl-6 py-2 mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-indigo-600 font-medium tracking-wide">
            {personalInfo.title}
          </p>
        </div>

        <div className="mb-10 flex justify-between items-start">
          <div className="space-y-1 text-sm text-slate-700">
            <p className="font-bold text-slate-900 text-lg">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="text-indigo-600 font-medium">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-sm font-bold text-slate-400">{today}</div>
        </div>

        <div className="flex-1 text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8">
          <p className="text-slate-900 font-bold text-lg">Sincerely,</p>
          <div className="mt-4 text-indigo-600 font-signature text-3xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
