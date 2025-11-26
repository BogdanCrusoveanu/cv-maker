import { Mail, Phone, MapPin } from 'lucide-react'

export default function MinimalTemplate({ cvData }) {
    const { personalInfo, experience, education, skills } = cvData

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        if (dateStr.toLowerCase() === 'present') return 'Present'
        const [year, month] = dateStr.split('-')
        return `${month}/${year}`
    }

    const renderSkillDots = (count = 3) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`w-2.5 h-2.5 rounded-full ${i < count ? 'bg-gray-900' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        )
    }

    // Group skills by category for display
    const skillsByCategory = skills.reduce((acc, skill) => {
        const category = skill.category || 'General'
        if (!acc[category]) acc[category] = []
        acc[category].push(skill.name)
        return acc
    }, {})

    return (
        <div className="flex min-h-full">
            {/* Black stripe */}
            <div className="w-4 bg-black flex-shrink-0"></div>

            {/* Yellow Sidebar */}
            <div className="w-1/3 bg-[#F4C430] p-8">
                {/* Photo */}
                <div className="mb-8">
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

                {/* Profile */}
                {personalInfo.summary && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold mb-2 pb-1 border-b-4 border-black inline-block">PROFILE</h3>
                        <p className="text-sm leading-relaxed mt-3 text-gray-900">{personalInfo.summary}</p>
                    </div>
                )}

                {/* Contact */}
                <div className="mb-8">
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
                        {/* Custom Fields */}
                        {(personalInfo.customFields || []).map(field => (
                            <div key={field.id} className="flex items-center gap-2 text-sm">
                                <span className="font-bold w-4">{field.label[0]}</span>
                                <span>{field.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Languages - Sidebar */}
                {(cvData.visibility.languages && cvData.languages && cvData.languages.length > 0) && (
                    <div className="mb-8">
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
                )}

                {/* Skills */}
                {(cvData.visibility.skills && skills.length > 0) && (
                    <div>
                        <h3 className="text-lg font-bold mb-3 pb-1 border-b-4 border-black inline-block">SKILLS</h3>
                        <div className="space-y-3 mt-4">
                            {skills.map(skill => (
                                <div key={skill.id} className="text-sm">
                                    <span className="font-medium">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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

                <div className="p-8">
                    {/* Professional Experience */}
                    {(cvData.visibility.experience && experience.length > 0) && (
                        <div className="mb-8">
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
                    )}

                    {/* Education */}
                    {(cvData.visibility.education && education.length > 0) && (
                        <div className="mb-8">
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
                    )}

                    {/* Custom Sections */}
                    {(cvData.visibility.customSections && cvData.customSections && cvData.customSections.length > 0) && cvData.customSections.map(section => (
                        <div key={section.id} className="mb-8">
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
                    ))}

                    {/* Interests */}
                    {(cvData.visibility.interests && cvData.interests && cvData.interests.length > 0) && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 pb-1 border-b-4 border-black inline-block">INTERESTS</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-4">
                                {cvData.interests.map(interest => (
                                    <li key={interest.id}>{interest.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
