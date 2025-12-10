import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { CoverLetterData } from "../../../types/coverLetter";

export default function AzureCoverLetter({ data }: { data: CoverLetterData }) {
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-sans bg-slate-50 flex shadow-2xl mx-auto overflow-hidden">
      {/* Sidebar Background */}
      <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#0F172A] z-0 print:bg-[#0F172A] print:w-1/3" />

      {/* Sidebar */}
      <div className="w-1/3 text-white p-8 min-h-full relative z-10 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 leading-tight">
            {personalInfo.fullName}
          </h1>
          <p className="text-lg text-blue-100 uppercase tracking-wide">
            {personalInfo.title}
          </p>
        </div>

        <div className="w-48 h-48 bg-blue-300 rounded-lg overflow-hidden shadow-lg transform rotate-3 border-4 border-white mb-10 mx-auto">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-700 bg-blue-100 font-bold text-2xl">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 text-sm font-medium text-blue-50 border-t border-blue-400/30 pt-8 mt-auto mb-8">
          {personalInfo.email && (
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-blue-300" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-blue-300" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-3">
              <MapPin size={16} className="shrink-0 text-blue-300" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-3">
              <Globe size={16} className="shrink-0 text-blue-300" />
              <span className="break-all">{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-12 bg-white relative z-10 flex flex-col">
        <div className="flex justify-between items-start mb-12 border-b-2 border-blue-100 pb-6">
          <div className="space-y-1 text-gray-600 text-sm">
            <p className="font-bold text-gray-900 text-base">
              {content.recipientName || "Recipient Name"}
            </p>
            <p className="text-blue-500 font-semibold">
              {content.recipientTitle || "Job Title"}
            </p>
            <p>{content.companyAddress || "Company Name"}</p>
            <p>{content.companyCityStateZip || "Address"}</p>
          </div>
          <div className="text-right">
            <span className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {today}
            </span>
          </div>
        </div>

        <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
          {content.body ||
            "Dear Hiring Manager,\n\nI am writing to express my interest..."}
        </div>

        <div className="mt-12 pt-8">
          <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
          <div className="mt-4 text-blue-600 font-signature text-2xl">
            {personalInfo.fullName}
          </div>
        </div>
      </div>
    </div>
  );
}
