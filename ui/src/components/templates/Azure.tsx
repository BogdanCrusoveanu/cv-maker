import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { CvData } from "../../types/cv";
import { useTranslation } from "react-i18next";

export default function Azure({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    if (!date) return "";
    return date.toLowerCase() === "present" || date.toLowerCase() === "ongoing"
      ? t("cv.present")
      : date;
  };

  // Define renderers for each section type
  const renderSection = (key: string) => {
    switch (key) {
      case "experience":
        return (
          cvData.visibility.experience &&
          experience.length > 0 && (
            <section key="experience">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                {t("cv.sections.experience")}
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-gray-200"
                  >
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-400"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800">{exp.title}</h3>
                      <span className="text-sm font-semibold text-blue-500">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 italic mb-2">
                      {exp.company}
                    </div>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "education":
        return (
          cvData.visibility.education &&
          education.length > 0 && (
            <section key="education">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                {t("cv.sections.education")}
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between">
                      <h3 className="font-bold text-gray-800">{edu.school}</h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <p className="text-gray-600">{edu.degree}</p>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      default:
        // Handle custom sections
        if (cvData.visibility.customSections && cvData.customSections) {
          if (key === "customSections") {
            return cvData.customSections.map((section) => (
              <section key={section.id}>
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative pl-4 border-l-2 border-gray-200"
                    >
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-400"></div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <span className="text-sm font-semibold text-blue-500">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 italic mb-2">
                        {item.subtitle}
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ));
          }
        }
        return null;
    }
  };

  // Main content sections (excluding sidebar items like skills, languages, interests)
  // Sidebar sections
  const renderSidebarSection = (key: string) => {
    switch (key) {
      case "skills":
        return (
          cvData.visibility.skills &&
          skills.length > 0 && (
            <section key="skills">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                {t("cv.sections.skills")}
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">
                        {skill.name}
                      </span>
                    </div>
                    {skill.showLevel !== false && (
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-400 transition-all duration-300"
                          style={{ width: `${skill.level || 75}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "languages":
        return (
          cvData.visibility.languages &&
          cvData.languages &&
          cvData.languages.length > 0 && (
            <section key="languages">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                {t("cv.sections.languages")}
              </h2>
              <div className="text-sm text-gray-600 space-y-2 flex flex-col !pl-0 !ml-0">
                {cvData.languages.map((lang) => (
                  <div key={lang.id} className="flex flex-col items-start mb-1">
                    <span className="font-medium text-gray-800">
                      {lang.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )
        );
      case "interests":
        return (
          cvData.visibility.interests &&
          cvData.interests &&
          cvData.interests.length > 0 && (
            <section key="interests">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-blue-400 pb-2 mb-4 uppercase">
                {t("cv.sections.interests")}
              </h2>
              <ul className="text-sm text-gray-600 space-y-2">
                {cvData.interests.map((interest) => (
                  <li key={interest.id}>• {interest.name}</li>
                ))}
              </ul>
            </section>
          )
        );
      default:
        return null;
    }
  };

  const sidebarSections = ["skills", "languages", "interests"];
  const mainSections = ["experience", "education", "customSections"];
  const order = cvData.sectionOrder || Object.keys(cvData.visibility);
  return (
    <div className="relative min-h-full font-sans bg-slate-50">
      {/* Absolute Background Layer for Sidebar */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#0F172A] print:bg-[#0F172A] z-0 print:fixed print:top-0 print:left-0 print:h-screen"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      />
      {/* Content Container */}
      <div className="relative z-10 flex min-h-full">
        {/* Left Sidebar */}
        <div className="w-1/3 text-white p-8 min-h-full relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div className="w-2/3">
              <h1 className="text-4xl font-bold mb-2">
                {personalInfo.fullName}
              </h1>
              <p className="text-xl text-blue-100 uppercase tracking-wide mb-6">
                {personalInfo.title}
              </p>
              <p className="text-sm text-blue-50 leading-relaxed max-w-lg">
                {personalInfo.summary}
              </p>
            </div>
            <div className="w-1/3 flex justify-end">
              <div className="w-40 h-40 bg-blue-300 rounded-lg overflow-hidden shadow-lg transform rotate-3 border-4 border-white">
                {personalInfo.photo ? (
                  <img
                    src={personalInfo.photo}
                    alt={personalInfo.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-700">
                    Photo
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium text-blue-50 border-t border-blue-300 pt-6">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />{" "}
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="hover:underline"
                >
                  {personalInfo.email}
                </a>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} />{" "}
                <a
                  href={`tel:${personalInfo.phone}`}
                  className="hover:underline"
                >
                  {personalInfo.phone}
                </a>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {personalInfo.location}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe size={16} />{" "}
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
              </div>
            )}
            {(personalInfo.customFields || []).map((field) => (
              <div key={field.id} className="flex items-center gap-2">
                <span className="opacity-75">{field.label}:</span>
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
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 flex gap-8 pb-10">
          {/* Left Column */}
          <div className="w-2/3 flex flex-col gap-8">
            {/* Render main sections based on order */}
            {order
              .filter((key) => mainSections.includes(key))
              .map((key) => renderSection(key))}
          </div>

          {/* Right Column */}
          <div className="w-1/3 flex flex-col gap-8">
            {/* Render sidebar sections based on order */}
            {order
              .filter((key) => sidebarSections.includes(key))
              .map((key) => renderSidebarSection(key))}
          </div>
        </div>
      </div>
    </div>
  );
}
