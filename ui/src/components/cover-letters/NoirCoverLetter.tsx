import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { CoverLetterData } from "../../types/coverLetter";

export default function NoirCoverLetter({ data }: { data: CoverLetterData }) {
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
      {/* Background Layer */}
      <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#111827] z-0 print:bg-[#111827] print:w-1/3" />

      {/* Sidebar */}
      <div className="w-1/3 text-white p-8 relative z-10 flex flex-col">
        <div className="mb-10 text-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-700 mx-auto mb-6 bg-gray-800">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-3xl">
                {personalInfo.fullName.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-400">
          <h3 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2 text-white">
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-3">
              <MapPin size={16} />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-3">
              <Globe size={16} />
              <span className="break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-12 bg-white relative z-10 flex flex-col">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-gray-900 uppercase tracking-tighter mb-2">
            {personalInfo.fullName}
          </h1>
          <div className="h-1 w-20 bg-yellow-400 mb-2"></div>
          <p className="text-xl text-gray-600 tracking-wide uppercase">
            {personalInfo.title}
          </p>
        </div>

        <div className="mb-8 p-4 border-l-4 border-gray-200">
          <div className="space-y-1 text-gray-600 text-sm">
            <p className="font-bold text-gray-900 text-base uppercase tracking-wider">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="text-gray-500 uppercase text-xs font-bold">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
            <p className="mt-4 text-gray-400 font-medium text-xs uppercase tracking-widest">
              {today}
            </p>
          </div>
        </div>

        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg uppercase tracking-wider">
            Sincerely,
          </p>
          <div className="mt-4 text-gray-900 font-signature text-3xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
