import { CvData } from "../../types/cv";

export default function Citrus({ cvData }: { cvData: CvData }) {
  const { personalInfo, experience, education, skills } = cvData;

  // Sidebar sections
  const renderSidebarSection = (key: string) => {
    switch (key) {
      case "personalInfo":
        return (
          <div key="contact">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Contact
            </h2>
            <div className="space-y-3 text-sm font-medium">
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.phone && (
                <p>
                  <a
                    href={`tel:${personalInfo.phone}`}
                    className="hover:underline"
                  >
                    {personalInfo.phone}
                  </a>
                </p>
              )}
              {personalInfo.email && (
                <p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="hover:underline"
                  >
                    {personalInfo.email}
                  </a>
                </p>
              )}
              {personalInfo.website && (
                <p>
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
              )}
              <p className="text-xs mt-2 opacity-75">
                @{personalInfo.fullName.replace(/\s+/g, "")}
              </p>
              {(personalInfo.customFields || []).map((field) => (
                <p key={field.id}>
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
              ))}
            </div>
          </div>
        );
      case "skills":
        return (
          cvData.visibility.skills &&
          skills.length > 0 && (
            <div key="skills">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 bg-gray-800 rounded-full"></span>{" "}
                Skills
              </h2>
              <ul className="space-y-2 text-sm font-medium">
                {skills.map((skill) => (
                  <li key={skill.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>{" "}
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )
        );
      case "languages":
        return (
          cvData.visibility.languages &&
          cvData.languages &&
          cvData.languages.length > 0 && (
            <div key="languages">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 bg-gray-800 rounded-full"></span>{" "}
                Languages
              </h2>
              <div className="space-y-3">
                {cvData.languages.map((lang) => (
                  <div
                    key={lang.id}
                    className="flex items-center justify-between text-sm font-medium"
                  >
                    <span>{lang.name}</span>
                    <div className="w-auto px-2 h-6 border-2 border-gray-800 rounded-full flex items-center justify-center text-[10px]">
                      {lang.proficiency}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "interests":
        return (
          cvData.visibility.interests &&
          cvData.interests &&
          cvData.interests.length > 0 && (
            <div key="interests">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2 h-2 bg-gray-800 rounded-full"></span>{" "}
                Interests
              </h2>
              <ul className="space-y-2 text-sm font-medium">
                {cvData.interests.map((interest) => (
                  <li key={interest.id} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>{" "}
                    {interest.name}
                  </li>
                ))}
              </ul>
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
            <div key="summary">
              <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>{" "}
                Profile
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {personalInfo.summary}
              </p>
            </div>
          )
        );
      case "education":
        return (
          cvData.visibility.education &&
          education.length > 0 && (
            <div key="education">
              <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>{" "}
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-bold text-gray-800">{edu.school}</h3>
                    <p className="text-sm text-gray-600 italic mb-1">
                      {edu.degree}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        );
      case "experience":
        return (
          cvData.visibility.experience &&
          experience.length > 0 && (
            <div key="experience">
              <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>{" "}
                Work Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="grid grid-cols-4 gap-4">
                    <div className="col-span-1 text-xs font-bold text-gray-400 pt-1">
                      {exp.startDate} - {exp.endDate}
                    </div>
                    <div className="col-span-3">
                      <h3 className="font-bold text-gray-800">{exp.title}</h3>
                      <p className="text-xs text-gray-500 uppercase mb-2">
                        {exp.company}
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  </div>
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
                <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>{" "}
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-4 gap-4">
                      <div className="col-span-1 text-xs font-bold text-gray-400 pt-1">
                        {item.date}
                      </div>
                      <div className="col-span-3">
                        <h3 className="font-bold text-gray-800">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 uppercase mb-2">
                          {item.subtitle}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
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

  const sidebarSections = ["personalInfo", "skills", "languages", "interests"];
  const mainSections = ["summary", "experience", "education", "customSections"];
  const order = cvData.sectionOrder || Object.keys(cvData.visibility);
  return (
    <div className="min-h-[90vh] bg-white flex font-sans">
      {/* Left Sidebar - Yellow */}
      <div className="w-1/3 bg-yellow-400 p-8 text-gray-800 flex flex-col gap-10 min-h-full pb-10">
        {/* Render sidebar sections based on order */}
        {order
          .filter((key) => sidebarSections.includes(key))
          .map((key) => renderSidebarSection(key))}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-10 pt-16 flex flex-col gap-10 pb-10">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-5xl font-bold text-gray-800 mb-2">
              {personalInfo.fullName.split(" ")[0]}
            </h1>
            <h1 className="text-5xl font-light text-gray-600 mb-4">
              {personalInfo.fullName.split(" ").slice(1).join(" ")}
            </h1>
          </div>
          <div className="w-32 h-32 bg-gray-200 overflow-hidden border-4 border-yellow-400">
            {personalInfo.photo ? (
              <img
                src={personalInfo.photo}
                alt={personalInfo.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Photo
              </div>
            )}
          </div>
        </div>

        {/* Render main sections based on order */}
        {order
          .filter((key) => mainSections.includes(key))
          .map((key) => renderMainSection(key))}
      </div>
    </div>
  );
}
