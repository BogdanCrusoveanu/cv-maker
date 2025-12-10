import { CvData } from "../../types/cv";
import { useTranslation } from "react-i18next";

export default function ModernTemplate({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return t("cv.present");
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
    // Fallback
    if (!month) return year;
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Sidebar sections
  const renderSidebarSection = (key: string) => {
    switch (key) {
      case "personalInfo":
        return (
          <div key="contact" className="flex flex-col gap-6">
            {personalInfo.location && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {t("cv.labels.location") || "Location"}
                </h3>
                <p className="text-sm">{personalInfo.location}</p>
                <div className="h-px bg-white/30 mt-3"></div>
              </div>
            )}

            {personalInfo.phone && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {t("cv.labels.phone") || "Phone"}
                </h3>
                <p className="text-sm">
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="hover:underline"
                  >
                    {personalInfo.phone}
                  </a>
                </p>
                <div className="h-px bg-white/30 mt-3"></div>
              </div>
            )}

            {personalInfo.email && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {t("cv.labels.email") || "Email"}
                </h3>
                <p className="text-sm break-all">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </p>
                <div className="h-px bg-white/30 mt-3"></div>
              </div>
            )}

            {personalInfo.website && (
              <div>
                <h3 className="font-bold text-lg mb-2">
                  {t("cv.labels.website") || "Website"}
                </h3>
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
                <div className="h-px bg-white/30 mt-3"></div>
              </div>
            )}

            {/* Custom Fields */}
            {(personalInfo.customFields || []).map((field) => (
              <div key={field.id} className="break-inside-avoid-page">
                <h3 className="font-bold text-lg mb-2">{field.label}</h3>
                <p className="text-sm">
                  {field.isUrl || /^(https?:\/\/|www\.)/i.test(field.value) ? (
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
                <div className="h-px bg-white/30 mt-3"></div>
              </div>
            ))}
          </div>
        );
      case "languages":
        return (
          cvData.visibility.languages &&
          cvData.languages &&
          cvData.languages.length > 0 && (
            <div key="languages" className="break-inside-avoid-page">
              <h3 className="font-bold text-lg mb-2">
                {t("cv.sections.languages")}
              </h3>
              <ul className="text-sm space-y-1">
                {cvData.languages.map((lang) => (
                  <li key={lang.id}>
                    <span className="font-medium">{lang.name}</span>
                    {lang.proficiency && (
                      <span className="opacity-75"> - {lang.proficiency}</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="h-px bg-white/30 mt-3"></div>
            </div>
          )
        );
      case "interests":
        return (
          cvData.visibility.interests &&
          cvData.interests &&
          cvData.interests.length > 0 && (
            <div key="interests" className="break-inside-avoid-page">
              <h3 className="font-bold text-lg mb-2">
                {t("cv.sections.interests")}
              </h3>
              <ul className="text-sm space-y-1">
                {cvData.interests.map((interest) => (
                  <li key={interest.id}>{interest.name}</li>
                ))}
              </ul>
              <div className="h-px bg-white/30 mt-3"></div>
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
      case "summary":
        return (
          cvData.visibility.summary &&
          personalInfo.summary && (
            <div key="summary" className="break-inside-avoid-page">
              <div className="mb-10">
                <h2 className="text-2xl font-light uppercase tracking-widest mb-6 text-gray-800">
                  {t("cv.sections.profile") || "About Me"}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {personalInfo.summary}
                </p>
              </div>
            </div>
          )
        );
      case "experience":
        return (
          cvData.visibility.experience &&
          experience.length > 0 && (
            <div key="experience">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mr-4">
                  {t("cv.sections.experience")}
                </h3>
                <div className="flex-1 h-0.5 bg-gray-900"></div>
              </div>
              <div className="space-y-5">
                {experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid-page">
                    <div className="mb-1">
                      <span className="font-bold text-gray-900">
                        {formatDate(exp.startDate) || "20XX"} –{" "}
                        {formatDate(exp.endDate) || "present"}
                      </span>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="font-semibold">{exp.title}</span>
                      {exp.company && <span> | {exp.company}</span>}
                      {exp.location && <span> | {exp.location}</span>}
                    </div>
                    {exp.description && (
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {exp.description.split("\n").map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
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
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mr-4">
                  {t("cv.sections.education")}
                </h3>
                <div className="flex-1 h-0.5 bg-gray-900"></div>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid-page">
                    <div className="text-sm">
                      <span className="font-semibold">{edu.school}</span>
                      {edu.location && <span> | {edu.location}</span>}
                    </div>
                    <div className="text-sm text-gray-700 flex gap-4">
                      <span className="font-medium">
                        {formatDate(edu.startDate) || "June 20XX"}
                      </span>
                      <span>{edu.degree}</span>
                      <span className="font-medium">
                        {formatDate(edu.endDate) || "June 20XX"}
                      </span>
                    </div>
                    {edu.gpa && (
                      <div className="text-sm text-gray-700">
                        GPA: {edu.gpa}
                      </div>
                    )}
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
            <div key="skills" className="break-inside-avoid-page">
              <div className="flex items-center mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mr-4">
                  {t("cv.sections.skills")}
                </h3>
                <div className="flex-1 h-0.5 bg-gray-900"></div>
              </div>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {skills.map((skill) => (
                  <li key={skill.id}>{skill.name}</li>
                ))}
              </ul>
            </div>
          )
        );
      default:
        // Handle custom sections
        if (cvData.visibility.customSections && cvData.customSections) {
          if (key === "customSections") {
            return cvData.customSections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mr-4">
                    {section.title}
                  </h3>
                  <div className="flex-1 h-0.5 bg-gray-900"></div>
                </div>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id} className="break-inside-avoid-page">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-gray-900">
                          {item.title}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-sm mb-2 font-semibold text-gray-800">
                        {item.subtitle}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-700 whitespace-pre-line">
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

  const sidebarSections = ["personalInfo", "languages", "interests"];
  const mainSections = [
    "summary", // Summary can be in main or sidebar, keeping in main for Modern
    "experience",
    "education",
    "customSections",
    "skills",
  ];
  const order = cvData.sectionOrder || Object.keys(cvData.visibility);

  return (
    <div className="relative min-h-full font-serif">
      {/* Absolute Background Layer for Sidebar */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#C85A54] print:bg-[#C85A54] z-0 print:fixed print:top-0 print:left-0 print:h-screen"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      />
      {/* Content Container */}
      <div className="relative z-10 flex min-h-full">
        {/* Sidebar - Terracotta Red */}
        <div className="w-1/3 text-white p-8 flex flex-col gap-6 pb-10 min-h-full">
          {/* Photo or Initials Box */}
          <div
            className="bg-white flex items-center justify-center"
            style={{ height: "150px" }}
          >
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#C85A54] text-5xl font-bold">
                {getInitials(personalInfo.fullName)}
              </span>
            )}
          </div>

          {/* Render sidebar sections based on order */}
          {order
            .filter((key) => sidebarSections.includes(key))
            .map((key) => renderSidebarSection(key))}
        </div>

        {/* Main Content */}
        <div className="w-2/3 p-10 bg-gray-50">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {personalInfo.fullName || "Your Name"}
            </h1>
            {personalInfo.title && (
              <h2 className="text-xl font-medium text-[#C85A54] mb-4">
                {personalInfo.title}
              </h2>
            )}
          </div>

          {/* Render main sections based on order */}
          <div className="flex flex-col gap-8">
            {order
              .filter((key) => mainSections.includes(key))
              .map((key) => renderMainSection(key))}
          </div>
        </div>
      </div>
    </div>
  );
}
