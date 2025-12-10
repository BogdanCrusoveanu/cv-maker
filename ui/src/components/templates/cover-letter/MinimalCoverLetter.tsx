import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { CoverLetterData } from "../../../types/coverLetter";

export default function MinimalCoverLetter({
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans bg-white flex shadow-2xl mx-auto overflow-hidden text-gray-900">
      {/* Yellow Sidebar */}
      <div className="w-1/3 bg-[#F4C430] p-8 flex flex-col gap-8 print:bg-[#F4C430] relative z-10 min-h-full">
        <div className="w-40 h-40 rounded-full overflow-hidden mx-auto border-4 border-black bg-white shadow-lg">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-3xl">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="space-y-4 text-sm mt-4">
          <h3 className="text-lg font-bold mb-3 pb-1 border-b-4 border-black inline-block uppercase">
            Contact
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span className="break-all hover:underline cursor-pointer">
                {personalInfo.email}
              </span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="shrink-0" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe size={16} className="shrink-0" />
              <span className="break-all hover:underline cursor-pointer">
                {personalInfo.website}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white flex flex-col relative z-20">
        <div className="bg-black text-white p-8">
          <h1 className="text-5xl font-bold uppercase tracking-wide">
            {personalInfo.fullName}
          </h1>
          <p className="text-sm mt-2 uppercase tracking-wider opacity-90">
            {personalInfo.title}
          </p>
        </div>

        <div className="p-12 flex-1 flex flex-col">
          <div className="mb-10 flex justify-between items-start">
            <div className="space-y-1 text-gray-800 text-sm">
              <p className="font-bold text-lg uppercase border-b-2 border-black inline-block mb-2">
                {content.recipientName || "Recipient Name"}
              </p>
              <p className="font-bold uppercase text-xs text-gray-500">
                {content.recipientTitle || "Job Title"}
              </p>
              <p>{content.companyAddress || "Company Name"}</p>
              <p>{content.companyCityStateZip || "Address"}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm bg-[#F4C430] px-3 py-1 inline-block text-black">
                {today}
              </p>
            </div>
          </div>

          <div className="flex-1 text-gray-800 leading-relaxed text-sm whitespace-pre-wrap">
            {content.body ||
              "Dear Hiring Manager,\n\nI am writing to express my interest..."}
          </div>

          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <p className="text-gray-900 font-bold text-lg uppercase">
              Sincerely,
            </p>
            <div className="mt-4 text-black font-signature text-2xl">
              {personalInfo.fullName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
