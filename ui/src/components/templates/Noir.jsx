import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Noir({ cvData }) {
    const { personalInfo, experience, education, skills } = cvData;
    return (
        <div className="flex min-h-full bg-white font-sans">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-900 text-white p-8 flex flex-col">
                <div className="mb-8 flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700">
                        {personalInfo.photo ? (
                            <img src={personalInfo.photo} alt={personalInfo.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500">No Photo</div>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">About Me</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">{personalInfo.summary}</p>
                </div>

                <div className="mb-8">
                    <h2 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Contact</h2>
                    <div className="space-y-3 text-sm text-gray-400">
                        {personalInfo.email && <div className="flex items-center gap-2"><Mail size={14} /> {personalInfo.email}</div>}
                        {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={14} /> {personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={14} /> {personalInfo.location}</div>}
                        {(personalInfo.customFields || []).map(field => (
                            <div key={field.id} className="flex items-center gap-2">
                                <span className="font-bold text-xs">{field.label}:</span> {field.value}
                            </div>
                        ))}
                    </div>
                </div>

                {(cvData.visibility.skills && skills.length > 0) && (
                    <div className="mb-8">
                        <h2 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Skills</h2>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {skills.map(skill => (
                                <li key={skill.id} className="flex justify-between">
                                    <span>{skill.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                    <div className="mb-8">
                        <h2 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Languages</h2>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {cvData.languages.map(lang => (
                                <li key={lang.id} className="flex justify-between">
                                    <span>{lang.name}</span>
                                    <span className="text-gray-500">{lang.proficiency}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {(cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                    <div>
                        <h2 className="text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Interests</h2>
                        <ul className="space-y-2 text-sm text-gray-400">
                            {cvData.interests.map(interest => (
                                <li key={interest.id}>{interest.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-10">
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 uppercase tracking-tighter mb-2">{personalInfo.fullName}</h1>
                    <div className="h-1 w-20 bg-yellow-400 mb-2"></div>
                    <p className="text-xl text-gray-600 tracking-wide uppercase">{personalInfo.title}</p>
                </div>

                {(cvData.visibility.experience && experience.length > 0) && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-light uppercase tracking-widest mb-6 text-gray-800">Experience</h2>
                        <div className="space-y-6">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 uppercase">{exp.title}</h3>
                                        <span className="text-sm text-gray-500">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 mb-2 uppercase">{exp.company}</div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(cvData.visibility.education && education.length > 0) && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-light uppercase tracking-widest mb-6 text-gray-800">Education</h2>
                        <div className="space-y-6">
                            {education.map(edu => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 uppercase">{edu.school}</h3>
                                        <span className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 uppercase">{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(cvData.visibility.customSections && cvData.customSections && cvData.customSections.length > 0) && cvData.customSections.map(section => (
                    <div key={section.id} className="mb-10">
                        <h2 className="text-2xl font-light uppercase tracking-widest mb-6 text-gray-800">{section.title}</h2>
                        <div className="space-y-6">
                            {section.items.map(item => (
                                <div key={item.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 uppercase">{item.title}</h3>
                                        <span className="text-sm text-gray-500">{item.date}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 mb-2 uppercase">{item.subtitle}</div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
