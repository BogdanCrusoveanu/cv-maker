import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function Slate({ cvData }) {
    const { personalInfo, experience, education, skills } = cvData;
    return (
        <div className="min-h-full bg-white font-serif text-gray-800">
            {/* Header */}
            <div className="bg-slate-700 text-white p-10 text-center">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-slate-500 mb-6 shadow-xl">
                    {personalInfo.photo ? (
                        <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-slate-600 flex items-center justify-center">Photo</div>
                    )}
                </div>
                <h1 className="text-4xl font-bold tracking-wider mb-2 uppercase">{personalInfo.fullName}</h1>
                <p className="text-lg text-slate-300 tracking-widest uppercase mb-6">{personalInfo.title}</p>

                <div className="flex justify-center gap-6 text-sm text-slate-300 flex-wrap">
                    {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone}</div>}
                    {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email}</div>}
                    {personalInfo.website && <div className="flex items-center gap-2"><Globe size={14} /> {personalInfo.website}</div>}
                    {(personalInfo.customFields || []).map(field => (
                        <div key={field.id} className="flex items-center gap-2">
                            <span className="opacity-75">{field.label}:</span> {field.value}
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-10 grid grid-cols-3 gap-10">
                {/* Left Sidebar */}
                <div className="col-span-1 space-y-8 border-r border-gray-200 pr-8">
                    <section>
                        <h2 className="text-lg font-bold uppercase text-slate-700 mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-slate-700 text-white flex items-center justify-center rounded-full text-xs">A</span>
                            About Me
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-600 text-justify">{personalInfo.summary}</p>
                    </section>

                    {(cvData.visibility.skills && skills.length > 0) && (
                        <section>
                            <h2 className="text-lg font-bold uppercase text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-slate-700 text-white flex items-center justify-center rounded-full text-xs">S</span>
                                Skills
                            </h2>
                            <div className="space-y-3">
                                {skills.map(skill => (
                                    <div key={skill.id}>
                                        <div className="flex justify-between text-xs font-bold mb-1 uppercase">{skill.name}</div>
                                        {skill.showLevel !== false && (
                                            <div className="h-1.5 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-full bg-slate-600 rounded-full transition-all duration-300"
                                                    style={{ width: `${skill.level || 75}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                        <section>
                            <h2 className="text-lg font-bold uppercase text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-slate-700 text-white flex items-center justify-center rounded-full text-xs">L</span>
                                Languages
                            </h2>
                            <div className="space-y-2">
                                {cvData.languages.map(lang => (
                                    <div key={lang.id} className="text-sm text-gray-600">
                                        <span className="font-bold">{lang.name}</span>
                                        {lang.proficiency && <span className="text-gray-500"> - {lang.proficiency}</span>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                        <section>
                            <h2 className="text-lg font-bold uppercase text-slate-700 mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 bg-slate-700 text-white flex items-center justify-center rounded-full text-xs">I</span>
                                Interests
                            </h2>
                            <ul className="text-sm text-gray-600 list-disc list-inside">
                                {cvData.interests.map(interest => (
                                    <li key={interest.id}>{interest.name}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </div>

                {/* Main Content */}
                <div className="col-span-2 space-y-8">
                    {(cvData.visibility.education && education.length > 0) && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-700 mb-6 uppercase border-b border-gray-300 pb-2">Education</h2>
                            <div className="space-y-6">
                                {education.map(edu => (
                                    <div key={edu.id} className="flex gap-4">
                                        <div className="w-24 pt-1 text-right text-sm font-bold text-slate-500">
                                            {edu.startDate && edu.startDate.split('-')[0]} - {edu.endDate && edu.endDate.split('-')[0]}
                                        </div>
                                        <div className="border-l-2 border-slate-200 pl-6 pb-2 relative">
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-700"></div>
                                            <h3 className="font-bold text-lg text-gray-800">{edu.school}</h3>
                                            <p className="text-slate-600 italic">{edu.degree}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(cvData.visibility.experience && experience.length > 0) && (
                        <section>
                            <h2 className="text-2xl font-bold text-slate-700 mb-6 uppercase border-b border-gray-300 pb-2">Experience</h2>
                            <div className="space-y-6">
                                {experience.map(exp => (
                                    <div key={exp.id} className="flex gap-4">
                                        <div className="w-24 pt-1 text-right text-sm font-bold text-slate-500">
                                            {exp.startDate && exp.startDate.split('-')[0]} - {exp.endDate === 'Present' ? 'Now' : exp.endDate && exp.endDate.split('-')[0]}
                                        </div>
                                        <div className="border-l-2 border-slate-200 pl-6 pb-2 relative">
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-700"></div>
                                            <h3 className="font-bold text-lg text-gray-800">{exp.title}</h3>
                                            <p className="text-slate-600 font-medium uppercase text-sm mb-2">{exp.company}</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {(cvData.visibility.customSections && cvData.customSections && cvData.customSections.length > 0) && cvData.customSections.map(section => (
                        <section key={section.id}>
                            <h2 className="text-2xl font-bold text-slate-700 mb-6 uppercase border-b border-gray-300 pb-2">{section.title}</h2>
                            <div className="space-y-6">
                                {section.items.map(item => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-24 pt-1 text-right text-sm font-bold text-slate-500">
                                            {item.date}
                                        </div>
                                        <div className="border-l-2 border-slate-200 pl-6 pb-2 relative">
                                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-700"></div>
                                            <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                                            <p className="text-slate-600 font-medium uppercase text-sm mb-2">{item.subtitle}</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                        </div>
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
