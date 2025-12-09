import { CoverLetterData } from "../../types/coverLetter";

export default function OrbitCoverLetter({ data }: { data: CoverLetterData }) {
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
      {/* Header Curve */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden z-0 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full text-blue-900 fill-current"
        >
          <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"></path>
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden z-0 opacity-50 pointer-events-none">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full text-orange-400 fill-current"
        >
          <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 pt-10 px-12">
        <div className="flex justify-between items-start mb-16">
          <div className="text-gray-900 mt-4 relative z-20">
            <h1 className="text-5xl font-bold mb-2 text-[#eb9747] drop-shadow-sm">
              {personalInfo.fullName}
            </h1>
            <p className="text-2xl font-light text-[#eb9747]">
              {personalInfo.title}
            </p>
          </div>
          {personalInfo.photo && (
            <div className="w-32 h-32 rounded-full border-8 border-white shadow-lg overflow-hidden bg-white z-20">
              <img
                src={personalInfo.photo}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex gap-12">
          {/* Left Column - Contact */}
          <div className="w-1/3 flex flex-col gap-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 shadow-sm text-sm space-y-3">
              <h3 className="font-bold text-blue-800 mb-4 uppercase tracking-wider text-xs">
                Contact
              </h3>
              {personalInfo.email && (
                <p className="break-all">
                  <span className="text-orange-500 mr-2">✉</span>
                  {personalInfo.email}
                </p>
              )}
              {personalInfo.phone && (
                <p>
                  <span className="text-orange-500 mr-2">📞</span>
                  {personalInfo.phone}
                </p>
              )}
              {personalInfo.address && (
                <p>
                  <span className="text-orange-500 mr-2">📍</span>
                  {personalInfo.address}
                </p>
              )}
              {personalInfo.website && (
                <p className="break-all">
                  <span className="text-orange-500 mr-2">🔗</span>
                  {personalInfo.website}
                </p>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="w-2/3 flex flex-col">
            <div className="mb-10 pb-6 border-b border-gray-200">
              <p className="font-bold text-blue-900 text-lg mb-1">
                {content.recipientName || "Recipient Name"}
              </p>
              <p className="font-semibold text-orange-500 text-sm">
                {content.recipientTitle || "Job Title"}
              </p>
              <p className="text-gray-600 text-sm mt-1">
                {content.companyAddress}
              </p>
              <p className="text-gray-600 text-sm">
                {content.companyCityStateZip}
              </p>

              <p className="mt-4 text-xs font-bold text-gray-400 uppercase">
                {today}
              </p>
            </div>

            <div className="flex-1 text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
              {content.body ||
                "Dear Hiring Manager,\n\nI am writing to express my interest..."}
            </div>

            <div className="mt-12 pt-8">
              <p className="text-gray-900 font-bold text-lg">Sincerely,</p>
              <div className="mt-4 text-orange-500 font-signature text-3xl">
                {personalInfo.fullName}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
