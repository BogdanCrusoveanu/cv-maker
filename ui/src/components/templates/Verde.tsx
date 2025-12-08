import { CvData } from "../../types/cv";

export default function VerdeTemplate({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (
      dateStr.toLowerCase() === "present" ||
      dateStr.toLowerCase() === "ongoing"
    )
      return "Ongoing";
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

  return (
    <div className="w-full min-h-[90vh] pb-10 bg-white font-sans text-gray-800">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-10 flex flex-col items-center text-center">
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt={personalInfo.fullName}
            className="w-32 h-32 rounded-full border-4 border-emerald-500 shadow-lg object-cover mb-4"
          />
        )}
        <h1 className="text-4xl font-bold mb-2 tracking-wide">
          {personalInfo.fullName}
        </h1>
        <p className="text-xl font-light text-emerald-100 mb-6">
          {personalInfo.title}
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      <div className="p-10 max-w-4xl mx-auto flex flex-col gap-10">
        {/* Summary */}
        {cvData.visibility.summary && personalInfo.summary && (
          <section className="text-center">
            <p className="text-lg leading-relaxed text-gray-600 italic">
              "{personalInfo.summary}"
            </p>
            <div className="w-16 h-1 bg-emerald-500 mx-auto mt-6 rounded"></div>
          </section>
        )}

        <div className="flex gap-10">
          {/* Left Column (Main) */}
          <div className="w-2/3 flex flex-col gap-8">
            {/* Experience */}
            {cvData.visibility.experience && experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-emerald-500 rounded-sm"></span>
                  Experience
                </h2>
                <div className="space-y-8 border-l border-emerald-100 ml-1 pl-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative">
                      <div className="absolute -left-[29px] top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white box-content"></div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {exp.title}
                      </h3>
                      <div className="text-emerald-600 font-medium mb-2">
                        {exp.company} | {formatDate(exp.startDate)} -{" "}
                        {formatDate(exp.endDate)}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
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
                  <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-emerald-500 rounded-sm"></span>
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h3 className="font-bold text-lg">{item.title}</h3>
                          <span className="text-sm text-gray-500">
                            {item.date}
                          </span>
                        </div>
                        <div className="text-emerald-600 font-medium mb-1">
                          {item.subtitle}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
          </div>

          {/* Right Column (Sidebar type) */}
          <div className="w-1/3 flex flex-col gap-8">
            {/* Education */}
            {cvData.visibility.education && education.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                  Education
                </h2>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <h3 className="font-bold text-gray-900">{edu.school}</h3>
                      <div className="text-emerald-600 text-sm mb-1">
                        {edu.degree}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </div>
                      {edu.gpa && (
                        <div className="text-xs text-gray-500">
                          GPA: {edu.gpa}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {cvData.visibility.skills && skills.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                  Skills
                </h2>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      {skill.showLevel && (
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
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
                <section>
                  <h2 className="text-xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                    Languages
                  </h2>
                  <ul className="space-y-2">
                    {cvData.languages.map((l) => (
                      <li key={l.id} className="text-sm">
                        <span className="font-semibold block text-gray-900">
                          {l.name}
                        </span>
                        <span className="text-emerald-600 text-xs">
                          {l.proficiency}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Interests */}
            {cvData.visibility.interests &&
              cvData.interests &&
              cvData.interests.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-emerald-800 mb-4 border-b border-emerald-100 pb-2">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {cvData.interests.map((int) => (
                      <span
                        key={int.id}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
                      >
                        {int.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
