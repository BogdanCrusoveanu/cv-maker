import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { CvData } from "../../types/cv";

export default function ClassicTemplate({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;

  // Sidebar sections
  const renderSidebarSection = (key: string) => {
    switch (key) {
      case "personalInfo":
        return (
          <div key="contact" className="space-y-4">
            {personalInfo.location && (
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{personalInfo.location}</p>
                </div>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="hover:underline"
                    >
                      {personalInfo.phone}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {personalInfo.email && (
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm break-all">
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="hover:underline"
                    >
                      {personalInfo.email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {personalInfo.website && (
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <a
                      href={
                        personalInfo.website.startsWith("http")
                          ? personalInfo.website
                          : `https://${personalInfo.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {personalInfo.website}
                    </a>
                  </p>
                </div>
              </div>
            )}
            {/* Custom Fields */}
            {(personalInfo.customFields || []).map((field) => (
              <div key={field.id} className="flex items-start gap-3">
                <div className="bg-white/20 p-2 rounded">
                  <Globe size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold opacity-75">{field.label}</p>
                  <p className="text-sm">
                    {field.isUrl ||
                    /^(https?:\/\/|www\.)/i.test(field.value) ? (
                      <a
                        href={
                          field.value.startsWith("http")
                            ? field.value
                            : `https://${field.value}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {field.value}
                      </a>
                    ) : (
                      field.value
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      case "languages":
        return (
          cvData.visibility.languages &&
          cvData.languages &&
          cvData.languages.length > 0 && (
            <div key="languages" className="pt-6 border-t border-white/20">
              <h3 className="font-bold text-lg mb-3">LANGUAGES</h3>
              <ul className="space-y-2">
                {cvData.languages.map((lang) => (
                  <li key={lang.id} className="text-sm">
                    <span className="font-semibold">{lang.name}</span>
                    {lang.proficiency && (
                      <span className="opacity-75"> - {lang.proficiency}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )
        );
      case "interests":
        return (
          cvData.visibility.interests &&
          cvData.interests &&
          cvData.interests.length > 0 && (
            <div key="interests" className="pt-6 border-t border-white/20">
              <h3 className="font-bold text-lg mb-3">INTERESTS</h3>
              <ul className="space-y-2">
                {cvData.interests.map((interest) => (
                  <li key={interest.id} className="text-sm">
                    {interest.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        );
      case "summary":
        return (
          cvData.visibility.summary &&
          personalInfo.summary && (
            <div key="summary" className="pt-6 border-t border-white/20">
              <h3 className="font-bold text-lg mb-3">OBJECTIVE</h3>
              <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
            </div>
          )
        );
      default:
        return null;
    }
  };

  // Main content sections
  const renderMainSection = (key: string) => {
    switch (key) {
      case "experience":
        return (
          cvData.visibility.experience &&
          experience.length > 0 && (
            <div key="experience">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#9B59B6" }}
              >
                EXPERIENCE
              </h3>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="mb-6 break-inside-avoid-page">
                    <div className="font-semibold text-sm text-gray-900">
                      {formatDate(exp.startDate) || "Dec 20XX"} –{" "}
                      {formatDate(exp.endDate) || "Jan 20XX"}
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {exp.title}
                      </span>
                      {exp.company && (
                        <span className="text-gray-700"> • {exp.company}</span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "education":
        return (
          cvData.visibility.education &&
          education.length > 0 && (
            <div key="education">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#9B59B6" }}
              >
                EDUCATION
              </h3>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="mb-4 break-inside-avoid-page">
                    <div className="text-sm">
                      <span className="font-semibold text-gray-900">
                        {edu.school}
                      </span>
                      {edu.location && (
                        <span className="text-gray-700">, {edu.location}</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-700">
                      • {edu.degree}, {formatDate(edu.endDate) || "20XX"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "skills":
        return (
          cvData.visibility.skills &&
          skills.length > 0 && (
            <div key="skills">
              <h3
                className="text-xl font-bold mb-4"
                style={{ color: "#9B59B6" }}
              >
                SKILLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )
        );
      default:
        // Handle custom sections
        if (cvData.visibility.customSections && cvData.customSections) {
          if (key === "customSections") {
            return cvData.customSections.map((section) => (
              <div key={section.id}>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: "#9B59B6" }}
                >
                  {section.title.toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="mb-4 break-inside-avoid-page">
                      <div className="font-semibold text-sm text-gray-900">
                        {item.date}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="text-gray-700">
                            {" "}
                            • {item.subtitle}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ));
          }
        }
        return null;
    }
  };

  const sidebarSections = ["personalInfo", "languages", "interests", "summary"];
  const mainSections = ["experience", "education", "customSections", "skills"];
  const order = cvData.sectionOrder || Object.keys(cvData.visibility);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return "Present";
    const [year, month] = dateStr.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  // SVG wave patterns
  const WavePattern = () => (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
      {/* Yellow wave */}
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "80px" }}
      >
        <path
          d="M0,60 C150,90 350,30 600,60 C850,90 1050,30 1200,60 L1200,120 L0,120 Z"
          fill="#F4D35E"
        />
      </svg>
      {/* Pink wave */}
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "60px" }}
      >
        <path
          d="M0,45 C200,75 400,15 600,45 C800,75 1000,15 1200,45 L1200,120 L0,120 Z"
          fill="#F4A6C8"
        />
      </svg>
      {/* Light purple wave */}
      <svg
        className="absolute bottom-0"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "40px" }}
      >
        <path
          d="M0,30 C250,60 450,0 600,30 C750,60 950,0 1200,30 L1200,120 L0,120 Z"
          fill="#E5D4ED"
        />
      </svg>
    </div>
  );

  return (
    <div className="relative flex min-h-full h-full font-serif">
      {/* Absolute Background Layer */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/3 z-0 overflow-hidden print:fixed print:top-0 print:left-0 print:h-screen"
        style={{
          background:
            "linear-gradient(to bottom, #E5D4ED 0%, #E5D4ED 40%, #2C3E50 40%, #2C3E50 100%)",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        <WavePattern />
      </div>

      {/* Sidebar - Transparent Content Wrapper */}
      <div className="w-1/3 relative z-10 min-h-full h-full">
        <div className="p-8">
          {/* Photo */}
          <div className="mb-8 flex justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-white">
              {personalInfo.photo ? (
                <img
                  src={personalInfo.photo}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <svg
                    className="w-20 h-20 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Render sidebar sections based on order */}
          <div className="text-white flex flex-col gap-6 mt-8">
            {order
              .filter((key) => sidebarSections.includes(key))
              .map((key) => renderSidebarSection(key))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 bg-white relative z-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
            {personalInfo.fullName || "Your Name"}
          </h1>
        </div>

        {/* Render main sections based on order */}
        <div className="flex flex-col gap-8">
          {order
            .filter((key) => mainSections.includes(key))
            .map((key) => renderMainSection(key))}
        </div>
      </div>
    </div>
  );
}
