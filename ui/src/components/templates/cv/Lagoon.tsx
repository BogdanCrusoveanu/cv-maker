import { CvData } from "../../types/cv";
import { useTranslation } from "react-i18next";

export default function Lagoon({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (
      dateStr.toLowerCase() === "present" ||
      dateStr.toLowerCase() === "ongoing"
    )
      return t("cv.present");
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
    if (!month) return year; // Fallback
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div
      className="w-full min-h-full pb-10 bg-white text-gray-800"
      style={{ fontFamily: "var(--font-family)" }}
    >
      {/* Header */}
      <header className="bg-[var(--primary-color)] text-white p-[calc(2rem*var(--density,1))]">
        <h1 className="text-4xl font-bold tracking-wide uppercase mb-2">
          {personalInfo.fullName}
        </h1>
        <p className="text-xl opacity-90 mb-6">{personalInfo.title}</p>

        <div className="flex flex-wrap gap-4 text-sm opacity-80">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span>📧</span>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span>📱</span>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <span>📍</span>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <span>🔗</span>
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>

      <div className="flex p-[calc(2rem*var(--density,1))] gap-[calc(2rem*var(--density,1))]">
        {/* Left Column */}
        <div className="w-2/3 flex flex-col gap-[calc(2rem*var(--density,1))]">
          {/* Summary */}
          {cvData.visibility.summary && personalInfo.summary && (
            <section>
              <h2 className="text-xl font-bold text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] mb-3 pb-1">
                {t("cv.sections.profile").toUpperCase() || "PROFILE"}
              </h2>
              <p className="text-sm leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {cvData.visibility.experience && experience.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-teal-700 border-b-2 border-teal-700 mb-4 pb-1">
                {t("cv.sections.experience").toUpperCase()}
              </h2>
              <div className="flex flex-col gap-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-lg">{exp.title}</h3>
                      <span className="text-sm font-medium text-gray-500">
                        {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                      </span>
                    </div>
                    <div className="text-teal-600 font-medium mb-2">
                      {exp.company} | {exp.location}
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
            </section>
          )}

          {/* Education */}
          {cvData.visibility.education && education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-teal-700 border-b-2 border-teal-700 mb-4 pb-1">
                {t("cv.sections.education").toUpperCase()}
              </h2>
              <div className="flex flex-col gap-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold">{edu.school}</h3>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{edu.degree}</span>
                      <span className="text-gray-500">
                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                      </span>
                    </div>
                    {edu.gpa && (
                      <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Section (Main) */}
          {cvData.visibility.customSections &&
            cvData.customSections &&
            cvData.customSections.map((section) => (
              <section key={section.id}>
                <h2 className="text-xl font-bold text-teal-700 border-b-2 border-teal-700 mb-4 pb-1 uppercase">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-4">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold">{item.title}</h3>
                        <span className="text-sm text-gray-500">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-teal-600 font-medium mb-1">
                        {item.subtitle}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>

        {/* Right Column */}
        <div className="w-1/3 flex flex-col gap-[calc(2rem*var(--density,1))]">
          {/* Skills */}
          {cvData.visibility.skills && skills.length > 0 && (
            <section className="bg-gray-50 p-4 rounded">
              <h2 className="text-lg font-bold text-teal-700 mb-3 uppercase">
                {t("cv.sections.skills")}
              </h2>
              <div className="flex flex-col gap-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    {skill.showLevel !== false && (
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${skill.level || 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {cvData.visibility.languages &&
            cvData.languages &&
            cvData.languages.length > 0 && (
              <section className="bg-gray-50 p-4 rounded">
                <h2 className="text-lg font-bold text-teal-700 mb-3 uppercase">
                  {t("cv.sections.languages")}
                </h2>
                <div className="space-y-2">
                  {cvData.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="text-sm flex flex-col gap-1 border-b border-gray-200 pb-1 last:border-0"
                    >
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-gray-500 text-xs">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          {/* Interests */}
          {cvData.visibility.interests &&
            cvData.interests &&
            cvData.interests.length > 0 && (
              <section className="bg-gray-50 p-4 rounded">
                <h2 className="text-lg font-bold text-teal-700 mb-3 uppercase">
                  {t("cv.sections.interests")}
                </h2>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {cvData.interests.map((int) => (
                    <li key={int.id}>{int.name}</li>
                  ))}
                </ul>
              </section>
            )}
        </div>
      </div>
    </div>
  );
}
