import { useTranslation } from "react-i18next";
import { CvData } from "../../../types/cv";

export default function AcademicTemplate({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.toLowerCase() === "present") return t("cv.present");
    const [year, month] = dateStr.split("-");
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    // Fallback if month is undefined (e.g. only year present)
    if (!month) return year;
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="w-full min-h-full h-full pb-10 bg-white text-black font-serif p-10 leading-relaxed">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-6 mb-6">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
          {personalInfo.fullName}
        </h1>
        <div className="flex justify-center gap-4 text-sm">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Summary */}
        {cvData.visibility.summary && personalInfo.summary && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
              {t("cv.sections.summary")}
            </h2>
            <p className="text-sm text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {/* Education */}
        {cvData.visibility.education && education.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
              {t("cv.sections.education")}
            </h2>
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>
                      {edu.school}, {edu.location}
                    </span>
                    <span>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <div className="text-sm italic">{edu.degree}</div>
                  {edu.gpa && <div className="text-sm">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {cvData.visibility.experience && experience.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
              {t("cv.sections.experience")}
            </h2>
            <div className="flex flex-col gap-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between font-bold text-sm">
                    <span>
                      {exp.company}, {exp.location}
                    </span>
                    <span>
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="text-sm italic mb-1">{exp.title}</div>
                  {exp.description && (
                    <ul className="list-disc list-outside ml-4 text-sm space-y-1">
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

        {/* Skills - Simple text list for academic look */}
        {cvData.visibility.skills && skills.length > 0 && (
          <section>
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
              {t("cv.sections.skills")}
            </h2>
            <p className="text-sm">{skills.map((s) => s.name).join(" • ")}</p>
          </section>
        )}

        {/* Custom Section */}
        {cvData.visibility.customSections &&
          cvData.customSections &&
          cvData.customSections.map((section) => (
            <section key={section.id}>
              <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
                {section.title}
              </h2>
              <div className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between font-bold text-sm">
                      <span>{item.title}</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="text-sm italic mb-1">{item.subtitle}</div>
                    <p className="text-sm whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

        {/* Languages & Interests mixed if small */}
        {((cvData.visibility.languages &&
          cvData.languages &&
          cvData.languages.length > 0) ||
          (cvData.visibility.interests &&
            cvData.interests &&
            cvData.interests.length > 0)) && (
          <div className="grid grid-cols-2 gap-8">
            {cvData.visibility.languages &&
              cvData.languages &&
              cvData.languages.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
                    {t("cv.sections.languages")}
                  </h2>
                  <ul className="text-sm">
                    {cvData.languages.map((l) => (
                      <li key={l.id}>
                        {l.name} ({l.proficiency})
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            {cvData.visibility.interests &&
              cvData.interests &&
              cvData.interests.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">
                    {t("cv.sections.interests")}
                  </h2>
                  <ul className="text-sm">
                    {cvData.interests.map((i) => (
                      <li key={i.id}>{i.name}</li>
                    ))}
                  </ul>
                </section>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
