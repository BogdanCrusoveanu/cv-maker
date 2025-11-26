import { CvData } from '../../types/cv';

export default function Citrus({ cvData }: { cvData: CvData }) {
    const { personalInfo, experience, education, skills } = cvData;
    return (
        <div className="min-h-full bg-white flex font-sans">
            {/* Left Sidebar - Yellow */}
            <div className="w-1/3 bg-yellow-400 p-8 text-gray-800 flex flex-col min-h-full">
                <div className="mb-10">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Contact
                    </h2>
                    <div className="space-y-3 text-sm font-medium">
                        <p>{personalInfo.location}</p>
                        <p>{personalInfo.phone}</p>
                        <p>{personalInfo.email}</p>
                        <p className="text-xs mt-2 opacity-75">@{personalInfo.fullName.replace(/\s+/g, '')}</p>
                        {(personalInfo.customFields || []).map(field => (
                            <p key={field.id}>{field.value}</p>
                        ))}
                    </div>
                </div>

                {(cvData.visibility.skills && skills.length > 0) && (
                    <div className="mb-10">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Skills
                        </h2>
                        <ul className="space-y-2 text-sm font-medium">
                            {skills.map(skill => (
                                <li key={skill.id} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {skill.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                    <div className="mb-10">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Languages
                        </h2>
                        <div className="space-y-3">
                            {cvData.languages.map(lang => (
                                <div key={lang.id} className="flex items-center justify-between text-sm font-medium">
                                    <span>{lang.name}</span>
                                    <div className="w-auto px-2 h-6 border-2 border-gray-800 rounded-full flex items-center justify-center text-[10px]">{lang.proficiency}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                    <div>
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 uppercase tracking-wide">
                            <span className="w-2 h-2 bg-gray-800 rounded-full"></span> Interests
                        </h2>
                        <ul className="space-y-2 text-sm font-medium">
                            {cvData.interests.map(interest => (
                                <li key={interest.id} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span> {interest.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-10 pt-16">
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-5xl font-bold text-gray-800 mb-2">{personalInfo.fullName.split(' ')[0]}</h1>
                        <h1 className="text-5xl font-light text-gray-600 mb-4">{personalInfo.fullName.split(' ').slice(1).join(' ')}</h1>
                    </div>
                    <div className="w-32 h-32 bg-gray-200 overflow-hidden border-4 border-yellow-400">
                        {personalInfo.photo ? (
                            <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Photo</div>
                        )}
                    </div>
                </div>

                {personalInfo.summary && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Profile
                        </h2>
                        <p className="text-gray-600 text-sm leading-relaxed">{personalInfo.summary}</p>
                    </div>
                )}

                {(cvData.visibility.education && education.length > 0) && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Education
                        </h2>
                        <div className="space-y-4">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-gray-800">{edu.school}</h3>
                                    <p className="text-sm text-gray-600 italic mb-1">{edu.degree}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(cvData.visibility.experience && experience.length > 0) && (
                    <div className="mb-10">
                        <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> Work Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map(exp => (
                                <div key={exp.id} className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 text-xs font-bold text-gray-400 pt-1">
                                        {exp.startDate} - {exp.endDate}
                                    </div>
                                    <div className="col-span-3">
                                        <h3 className="font-bold text-gray-800">{exp.title}</h3>
                                        <p className="text-xs text-gray-500 uppercase mb-2">{exp.company}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(cvData.visibility.customSections && cvData.customSections && cvData.customSections.length > 0) && cvData.customSections.map(section => (
                    <div key={section.id} className="mb-10">
                        <h2 className="text-lg font-bold uppercase mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span> {section.title}
                        </h2>
                        <div className="space-y-6">
                            {section.items.map(item => (
                                <div key={item.id} className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 text-xs font-bold text-gray-400 pt-1">
                                        {item.date}
                                    </div>
                                    <div className="col-span-3">
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <p className="text-xs text-gray-500 uppercase mb-2">{item.subtitle}</p>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
