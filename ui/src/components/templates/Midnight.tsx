import { Phone, MapPin, Globe, Heart, PenTool, Monitor } from 'lucide-react';
import { CvData } from '../../types/cv';

export default function Midnight({ cvData }: { cvData: CvData }) {
    const { personalInfo, experience, education, skills } = cvData;
    return (
        <div className="min-h-full flex font-sans bg-gray-900 text-gray-100">
            {/* Sidebar - Dark Blue/Gray */}
            <div className="w-1/3 bg-gray-800 p-8 flex flex-col items-center text-center border-r border-gray-700">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-400 mb-6 shadow-2xl">
                    {personalInfo.photo ? (
                        <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500">Photo</div>
                    )}
                </div>

                <h1 className="text-3xl font-bold text-yellow-400 mb-2">{personalInfo.fullName}</h1>
                <p className="text-lg text-gray-300 font-light mb-8">{personalInfo.title}</p>

                <div className="w-full space-y-6 text-left">
                    <div>
                        <h3 className="text-yellow-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                            <span className="bg-yellow-400 text-gray-900 rounded-full p-1"><Phone size={12} /></span> Contact
                        </h3>
                        <div className="space-y-2 text-sm text-gray-300 pl-2 border-l border-gray-600">
                            <p>{personalInfo.email}</p>
                            <p>{personalInfo.phone}</p>
                            <p>{personalInfo.website}</p>
                            <p>{personalInfo.location}</p>
                            {(personalInfo.customFields || []).map(field => (
                                <p key={field.id}>{field.value}</p>
                            ))}
                        </div>
                    </div>

                    {(cvData.visibility.skills && skills.length > 0) && (
                        <div>
                            <h3 className="text-yellow-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="bg-yellow-400 text-gray-900 rounded-full p-1"><PenTool size={12} /></span> Skills
                            </h3>
                            <div className="space-y-3 pl-2">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="flex justify-between text-xs mb-1">{skill.name}</div>
                                        {skill.showLevel !== false && (
                                            <div className="h-1.5 bg-gray-700 rounded-full">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                                    style={{ width: `${skill.level || 75}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                        <div>
                            <h3 className="text-yellow-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="bg-yellow-400 text-gray-900 rounded-full p-1"><Globe size={12} /></span> Languages
                            </h3>
                            <div className="text-sm text-gray-300 pl-2 space-y-1">
                                {cvData.languages.map(lang => (
                                    <div key={lang.id} className="flex justify-between">
                                        <span>{lang.name}</span>
                                        <span className="text-gray-500">{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                        <div>
                            <h3 className="text-yellow-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                <span className="bg-yellow-400 text-gray-900 rounded-full p-1"><Heart size={12} /></span> Interests
                            </h3>
                            <div className="text-sm text-gray-300 pl-2">
                                {cvData.interests.map(interest => (
                                    <p key={interest.id}>{interest.name}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-10 bg-white text-gray-800">
                {personalInfo.summary && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-yellow-400 p-2 rounded-lg text-gray-900"><Monitor size={20} /></span> Profile
                        </h2>
                        <p className="text-gray-600 leading-relaxed border-l-4 border-yellow-400 pl-4">
                            {personalInfo.summary}
                        </p>
                    </section>
                )}

                {(cvData.visibility.experience && experience.length > 0) && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="bg-yellow-400 p-2 rounded-lg text-gray-900"><MapPin size={20} /></span> Experience
                        </h2>
                        <div className="space-y-8 border-l border-gray-200 ml-3 pl-8 relative">
                            {experience.map(exp => (
                                <div key={exp.id} className="relative">
                                    <div className="absolute -left-[39px] top-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-white"></div>
                                    <h3 className="text-lg font-bold text-gray-900">{exp.title}</h3>
                                    <div className="text-sm text-gray-500 mb-2 font-medium">
                                        {exp.company} | {exp.location} <br />
                                        <span className="text-yellow-600">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(cvData.visibility.education && education.length > 0) && (
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="bg-yellow-400 p-2 rounded-lg text-gray-900"><Globe size={20} /></span> Education
                        </h2>
                        <div className="space-y-6">
                            {education.map(edu => (
                                <div key={edu.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                    <p className="text-gray-600 text-sm">{edu.school} | {edu.location}</p>
                                    <p className="text-sm text-gray-400 mt-1">Graduated: {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {(cvData.visibility.customSections && cvData.customSections && cvData.customSections.length > 0) && cvData.customSections.map(section => (
                    <section key={section.id} className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="bg-yellow-400 p-2 rounded-lg text-gray-900"><PenTool size={20} /></span> {section.title}
                        </h2>
                        <div className="space-y-6">
                            {section.items.map(item => (
                                <div key={item.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-400">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                                        <span className="text-sm text-gray-500">{item.date}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium">{item.subtitle}</p>
                                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
