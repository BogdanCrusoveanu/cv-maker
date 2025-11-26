import { Mail, Phone, MapPin, Globe } from 'lucide-react'
import { CvData } from '../../types/cv';

export default function MinimalTemplate({ cvData }: { cvData: CvData }) {
    const { personalInfo, experience, education, skills } = cvData

    // Sidebar sections
    const renderSidebarSection = (key: string) => {
        switch (key) {
            case 'personalInfo':
                return (
                    <div key="contact">
                        <h3 className="text-lg font-bold mb-3 pb-1 border-b-4 border-black inline-block">CONTACT</h3>
                        <div className="space-y-3 mt-4">
                            {personalInfo.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="flex-shrink-0" />
                                    <span className="break-all">{personalInfo.email}</span>
                                </div>
                            )}
                            {personalInfo.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="flex-shrink-0" />
                                    <span>{personalInfo.phone}</span>
                                </div>
                            )}
                            {personalInfo.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin size={16} className="flex-shrink-0" />
                                    <span>{personalInfo.location}</span>
                                </div>
                            )}
                            {personalInfo.website && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe size={16} className="flex-shrink-0" />
                                    <span className="break-all">{personalInfo.website}</span>
                                </div>
                            )}
                            {/* Custom Fields */}
                            {(personalInfo.customFields || []).map(field => (
                                <div key={field.id} className="flex items-center gap-2 text-sm">
                                    <span className="font-bold w-4">{field.label[0]}</span>
                                    <span>{field.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'summary':
                return (cvData.visibility.summary && personalInfo.summary) && (
                    <div key="summary">
                        <h3 className="text-lg font-bold mb-2 pb-1 border-b-4 border-black inline-block">PROFILE</h3>
                        <p className="text-sm leading-relaxed mt-3 text-gray-900">{personalInfo.summary}</p>
                    </div>
                );
            case 'languages':
                return (cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                    <div key="languages">
                        <h3 className="text-lg font-bold mb-3 pb-1 border-b-4 border-black inline-block">LANGUAGES</h3>
                        <div className="space-y-2 mt-4">
                            {cvData.languages.map(lang => (
                                <div key={lang.id} className="text-sm">
                                    <span className="font-semibold">{lang.name}</span>
                                    {lang.proficiency && <span className="block text-xs opacity-75">{lang.proficiency}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'skills':
                return (cvData.visibility.skills && skills.length > 0) && (
                    <div key="skills">
                        <h3 className="text-lg font-bold mb-3 pb-1 border-b-4 border-black inline-block">SKILLS</h3>
                        <div className="space-y-3 mt-4">
                            {skills.map(skill => (
                                <div key={skill.id} className="text-sm">
                                    <span className="font-medium">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Main content sections
    const renderMainSection = (key: string) => {
        switch (key) {
            case 'experience':
                return (cvData.visibility.experience && experience.length > 0) && (
                    <div key="experience">
                        <h3 className="text-xl font-bold mb-4 pb-1 border-b-4 border-black inline-block">PROFESSIONAL EXPERIENCE</h3>
                        <div className="space-y-5 mt-4">
                            {experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="font-bold text-sm uppercase text-gray-600 mb-1">
                                        {exp.title}
                                        {exp.company && <span> | {exp.company}</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-2">
                                        {formatDate(exp.startDate) || 'Sept. 20XX'} - {formatDate(exp.endDate) || 'Jul. 20XX'}
                                    </div>
                                    {exp.description && (
                                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                            {exp.description.split('\n').map((line, idx) => (
                                                <li key={idx}>{line}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'education':
                return (cvData.visibility.education && education.length > 0) && (
                    <div key="education">
                        <h3 className="text-xl font-bold mb-4 pb-1 border-b-4 border-black inline-block">EDUCATION</h3>
                        <div className="space-y-4 mt-4">
                            {education.map((edu) => (
                                <div key={edu.id} className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-[#F4C430] rounded-full mt-2 flex-shrink-0"></div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm uppercase">
                                            {edu.degree} | {formatDate(edu.startDate) || '20XX'} - {formatDate(edu.endDate) || '20XX'}
                                        </div>
                                        <div className="text-sm text-gray-600">{edu.school}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'interests':
                return (cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                    <div key="interests">
                        <h3 className="text-xl font-bold mb-4 pb-1 border-b-4 border-black inline-block">INTERESTS</h3>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-4">
                            {cvData.interests.map(interest => (
                                <li key={interest.id}>{interest.name}</li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                // Handle custom sections
                if (cvData.visibility.customSections && cvData.customSections) {
                    if (key === 'customSections') {
                         return cvData.customSections.map(section => (
                            <div key={section.id}>
                                <h3 className="text-xl font-bold mb-4 pb-1 border-b-4 border-black inline-block">{section.title.toUpperCase()}</h3>
                                <div className="space-y-4 mt-4">
                                    {section.items.map(item => (
                                        <div key={item.id}>
                                            <div className="font-bold text-sm uppercase text-gray-600 mb-1">
                                                {item.title}
                                                {item.subtitle && <span> | {item.subtitle}</span>}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-2">
                                                {item.date}
                                            </div>
                                            {item.description && (
                                                <p className="text-sm text-gray-700 whitespace-pre-line">{item.description}</p>
                                            )}
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

    const sidebarSections = ['personalInfo', 'summary', 'languages', 'skills'];
    const mainSections = ['experience', 'education', 'customSections', 'interests'];
    const order = cvData.sectionOrder || Object.keys(cvData.visibility);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return ''
        if (dateStr.toLowerCase() === 'present') return 'Present'
        const [year, month] = dateStr.split('-')
        return `${month}/${year}`
    }

    return (
        <div className="flex min-h-full">
            {/* Black stripe */}
            <div className="w-4 bg-black flex-shrink-0"></div>

            {/* Yellow Sidebar */}
            <div className="w-1/3 bg-[#F4C430] p-8 flex flex-col gap-8">
                {/* Photo */}
                <div>
                    <div className="w-40 h-40 rounded-full overflow-hidden mx-auto border-4 border-black bg-white">
                        {personalInfo.photo ? (
                            <img
                                src={personalInfo.photo}
                                alt={personalInfo.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render sidebar sections based on order */}
                {order.filter(key => sidebarSections.includes(key)).map(key => renderSidebarSection(key))}
            </div>

            {/* Main Content - White with Black Header */}
            <div className="flex-1 bg-white">
                {/* Black header bar */}
                <div className="bg-black text-white p-8">
                    <h1 className="text-5xl font-bold uppercase tracking-wide">
                        {personalInfo.fullName || 'NAME'}
                    </h1>
                    {personalInfo.title && (
                        <p className="text-sm mt-2 uppercase tracking-wider">{personalInfo.title}</p>
                    )}
                </div>

                <div className="p-8 flex flex-col gap-8">
                    {/* Render main sections based on order */}
                    {order.filter(key => mainSections.includes(key)).map(key => renderMainSection(key))}
                </div>
            </div>
        </div>
    )
}
