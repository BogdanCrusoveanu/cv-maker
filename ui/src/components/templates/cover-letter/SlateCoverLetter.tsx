import { Mail, Phone, Globe, MapPin } from "lucide-react";
import { CoverLetterData } from "../../../types/coverLetter";

export default function SlateCoverLetter({ data }: { data: CoverLetterData }) {
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
    <div className="relative min-h-[29.7cm] w-[21cm] font-serif bg-white text-gray-800 flex flex-col shadow-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="bg-slate-700 text-white p-10 text-center relative z-20 flex-shrink-0">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-slate-500 mb-6 shadow-xl bg-slate-600">
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-wider mb-2 uppercase">
          {personalInfo.fullName}
        </h1>
        <p className="text-lg text-slate-300 tracking-widest uppercase mb-6">
          {personalInfo.title}
        </p>

        <div className="flex justify-center gap-6 text-sm text-slate-300 flex-wrap">
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} /> {personalInfo.phone}
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} /> {personalInfo.email}
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin size={14} /> {personalInfo.address}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe size={14} /> {personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-12 bg-white relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start mb-12 border-b border-gray-200 pb-8">
            <div>
              <p className="font-bold text-gray-900 text-lg">
                {content.recipientName || "Recipient Name"}
              </p>
              <p className="text-slate-600 font-medium uppercase text-sm mb-1">
                {content.recipientTitle || "Job Title"}
              </p>
              <p className="text-gray-600 text-sm">
                {content.companyAddress || "Company Name"}
              </p>
              <p className="text-gray-600 text-sm">
                {content.companyCityStateZip || "Address"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 font-medium">{today}</p>
            </div>
          </div>

          <div className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap font-serif">
            {content.body ||
              "Dear Hiring Manager,\n\nI am writing to express my interest..."}
          </div>

          <div className="mt-16">
            <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
            <p className="text-slate-700 font-signature text-3xl mt-4">
              {personalInfo.fullName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
