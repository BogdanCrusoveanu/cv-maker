import { CvData } from "../../types/cv";
import { useTranslation } from "react-i18next";

export default function PolygonalTemplate({ cvData }: { cvData: CvData }) {
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
    if (!month) return year;
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="w-full min-h-full h-full pb-10 bg-slate-50 relative font-sans">
      {/* Background Polygon Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none print:hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4 z-0"></div>
      </div>

      {/* Absolute Sidebar Background - Fixed for Print */}
      <div
        className="hidden print:block absolute top-0 bottom-0 left-0 w-[35%] bg-slate-900 z-0 print:fixed print:top-0 print:left-0 print:h-screen"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      />

      {/* Sidebar / Main Content Split */}
      <div className="flex relative z-10 min-h-full h-full">
        {" "}
        {/* Ensure full height for sidebar bg */}
        {/* Sidebar */}
        <div className="w-[35%] bg-slate-900 text-white p-8 flex flex-col gap-8 min-h-full h-full relative z-10 print:bg-transparent">
          <div className="text-center mb-4">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-slate-700 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mx-auto shadow-xl text-3xl font-bold">
                {personalInfo.fullName.charAt(0)}
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="text-sm space-y-3 opacity-90">
            {personalInfo.email && (
              <div className="flex flex-col">
                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  {t("cv.labels.email") || "Email"}
                </span>
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex flex-col">
                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  {t("cv.labels.phone") || "Phone"}
                </span>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex flex-col">
                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  {t("cv.labels.location") || "Location"}
                </span>
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex flex-col">
                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  {t("cv.labels.website") || "Portfolio"}
                </span>
                <span className="break-all">{personalInfo.website}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {cvData.visibility.skills && skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4 text-indigo-400">
                {t("cv.sections.skills").toUpperCase()}
              </h3>
              <div className="flex flex-col gap-3">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      {skill.showLevel && <span>{skill.level}%</span>}
                    </div>
                    {skill.showLevel && (
                      <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {cvData.visibility.languages &&
            cvData.languages &&
            cvData.languages.length > 0 && (
              <div>
                <h3 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4 text-pink-400">
                  {t("cv.sections.languages").toUpperCase()}
                </h3>
                <ul className="space-y-2 text-sm">
                  {cvData.languages.map((l) => (
                    <li key={l.id} className="flex flex-col">
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-slate-400 text-xs">
                        {l.proficiency}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Interests */}
          {cvData.visibility.interests &&
            cvData.interests &&
            cvData.interests.length > 0 && (
              <div>
                <h3 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4 text-emerald-400">
                  {t("cv.sections.interests").toUpperCase()}
                </h3>
                <ul className="space-y-2 text-sm">
                  {cvData.interests.map((interest) => (
                    <li key={interest.id} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span>{interest.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
        {/* Main */}
        <div className="w-[65%] p-10 flex flex-col gap-8 bg-white/80 backdrop-blur-sm">
          {/* Header Text */}
          <div className="border-l-4 border-indigo-500 pl-6 py-2">
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-none mb-2">
              {personalInfo.fullName}
            </h1>
            <p className="text-xl text-indigo-600 font-medium tracking-wide">
              {personalInfo.title}
            </p>
          </div>

          {/* Summary */}
          {cvData.visibility.summary && personalInfo.summary && (
            <p className="text-slate-600 leading-relaxed text-sm">
              {personalInfo.summary}
            </p>
          )}

          {/* Experience */}
          {cvData.visibility.experience && experience.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center mr-3 text-sm">
                  💼
                </span>
                {t("cv.sections.experience").toUpperCase()}
              </h3>
              <div className="border-l-2 border-indigo-100 ml-4 pl-8 space-y-8">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="absolute -left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-500"></div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">
                        {exp.title}
                      </h4>
                      <div className="text-indigo-600 font-medium text-sm mb-2">
                        {exp.company} • {formatDate(exp.startDate)} -{" "}
                        {formatDate(exp.endDate)}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-600 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {cvData.visibility.education && education.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded flex items-center justify-center mr-3 text-sm">
                  🎓
                </span>
                {t("cv.sections.education").toUpperCase()}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-800">{edu.school}</h4>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    <div className="text-pink-600 text-sm font-medium">
                      {edu.degree}
                    </div>
                    {edu.gpa && (
                      <div className="text-xs text-slate-500 mt-1">
                        GPA: {edu.gpa}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {cvData.visibility.customSections &&
            cvData.customSections &&
            cvData.customSections.map((section) => (
              <section key={section.id}>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded flex items-center justify-center mr-3 text-sm">
                    ★
                  </span>
                  {section.title.toUpperCase()}
                </h3>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-slate-800">
                          {item.title}
                        </h4>
                        <span className="text-sm text-slate-500">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-indigo-600 text-sm mb-1">
                        {item.subtitle}
                      </div>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </div>
  );
}
