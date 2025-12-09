import { CvData } from "../../types/cv";

export default function OrbitTemplate({ cvData }: { cvData: CvData }) {
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
    <div className="w-full min-h-full pb-10 bg-white font-sans text-gray-800 relative">
      {/* Header Curve */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden z-0">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full text-blue-900 fill-current"
        >
          <path d="M0.00,49.98 C149.99,150.00 349.20,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"></path>
        </svg>
      </div>
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden z-0 opacity-50">
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          className="w-full h-full text-orange-400 fill-current"
        >
          <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,0.00 L0.00,0.00 Z"></path>
        </svg>
      </div>

      <div className="relative z-10 pt-10 px-10">
        <div className="flex justify-between items-start mb-16">
          <div className="text-gray-900 mt-4 relative z-20">
            <h1 className="text-5xl font-bold mb-2 text-shadow-sm text-[#eb9747]">
              {personalInfo.fullName}
            </h1>
            <p className="text-2xl font-light text-[#eb9747]">
              {personalInfo.title}
            </p>
          </div>
          {personalInfo.photo ? (
            <img
              src={personalInfo.photo}
              alt={personalInfo.fullName}
              className="w-40 h-40 rounded-full border-8 border-white shadow-lg object-cover bg-white"
            />
          ) : (
            <div className="w-40 h-40 rounded-full border-8 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold">
              {personalInfo.fullName.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex gap-12">
          {/* Left Sidebar */}
          <div className="w-1/3 flex flex-col gap-8">
            {/* Contact Info Box */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 shadow-sm">
              <h3 className="font-bold text-blue-800 mb-4 uppercase tracking-wider text-sm">
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                {personalInfo.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✉</span>
                    <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">📞</span>
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">📍</span>
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">🔗</span>
                    <span className="break-all">{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            {cvData.visibility.skills && skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-blue-900 border-b-2 border-orange-200 mb-3 uppercase tracking-wider">
                  Skills
                </h2>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex justify-between text-sm mb-1 font-medium">
                        <span>{skill.name}</span>
                      </div>
                      {skill.showLevel && (
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
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
                  <h2 className="text-lg font-bold text-blue-900 border-b-2 border-orange-200 mb-3 uppercase tracking-wider">
                    Languages
                  </h2>
                  <div className="space-y-2 text-sm flex flex-col !pl-0 !ml-0">
                    {cvData.languages.map((l) => (
                      <div
                        key={l.id}
                        className="flex flex-col items-start mb-1"
                      >
                        <span className="font-semibold text-gray-900">
                          {l.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {l.proficiency}
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
                <section>
                  <h2 className="text-lg font-bold text-blue-900 border-b-2 border-orange-200 mb-3 uppercase tracking-wider">
                    Interests
                  </h2>
                  <ul className="space-y-2 text-sm">
                    {cvData.interests.map((interest) => (
                      <li key={interest.id} className="flex items-center gap-2">
                        <span className="text-orange-500 text-xs">●</span>
                        <span>{interest.name}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
          </div>

          {/* Main Content */}
          <div className="w-2/3 flex flex-col gap-10">
            {/* Summary */}
            {cvData.visibility.summary && personalInfo.summary && (
              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                  Profile
                </h2>
                <p className="text-gray-700 leading-relaxed border-l-2 border-gray-200 pl-4">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {cvData.visibility.experience && experience.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                  Experience
                </h2>
                <div className="space-y-8">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-xl text-gray-800">
                          {exp.title}
                        </h3>
                        <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                          {formatDate(exp.startDate)} –{" "}
                          {formatDate(exp.endDate)}
                        </span>
                      </div>
                      <div className="text-blue-600 font-medium mb-3">
                        {exp.company} | {exp.location}
                      </div>
                      {exp.description && (
                        <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
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
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                  Education
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="relative pl-8 border-l border-gray-200 break-inside-avoid-page"
                    >
                      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {edu.school}
                      </h3>
                      <div className="flex justify-between items-center mt-1 mb-2">
                        <span className="text-blue-600 font-medium text-sm">
                          {edu.degree}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(edu.startDate)} –{" "}
                          {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.gpa && (
                        <div className="text-xs text-gray-600">
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
                  <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 p-4 rounded-lg break-inside-avoid-page"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-gray-800">
                            {item.title}
                          </h3>
                          <span className="text-sm font-semibold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                            {item.date}
                          </span>
                        </div>
                        <div className="text-blue-600 font-medium mb-3">
                          {item.subtitle}
                        </div>
                        <p className="text-sm text-gray-600">
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
    </div>
  );
}
