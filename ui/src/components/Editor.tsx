import { Upload, Plus, X, Eye, EyeOff, Trash2, ArrowUp, ArrowDown, Link } from 'lucide-react'
import { useEffect } from 'react'
import api from '../services/api'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { TextArea } from './ui/TextArea'
import { Select } from './ui/Select'
import { SectionHeader } from './ui/SectionHeader'
import { CvData, Experience, Education, Skill, Language, CustomSectionItem, CustomField, PersonalInfo } from '../types/cv'

interface EditorProps {
    cvData: CvData;
    setCvData: (data: CvData) => void;
    currentTemplate: string;
}

export default function Editor({ cvData, setCvData, currentTemplate }: EditorProps) {
    const toggleVisibility = (section: string) => {
        setCvData({
            ...cvData,
            visibility: {
                ...cvData.visibility,
                [section]: !cvData.visibility[section]
            }
        })
    }

    // Ensure visibility keys exist (migration for existing CVs)
    useEffect(() => {
        if (cvData.visibility && (cvData.visibility.personalInfo === undefined || cvData.visibility.summary === undefined)) {
            setCvData({
                ...cvData,
                visibility: {
                    ...cvData.visibility,
                    personalInfo: cvData.visibility.personalInfo ?? true,
                    summary: cvData.visibility.summary ?? true
                }
            });
        }
    }, [cvData.visibility]);

    // Initialize section order if not present
    if (!cvData.sectionOrder) {
    }

    // Ensure sectionOrder contains all visibility keys (migration for existing CVs)
    useEffect(() => {
        if (cvData.sectionOrder) {
            const allKeys = Object.keys(cvData.visibility);
            const missingKeys = allKeys.filter(key => !cvData.sectionOrder?.includes(key));
            
            if (missingKeys.length > 0) {
                setCvData({
                    ...cvData,
                    sectionOrder: [...cvData.sectionOrder, ...missingKeys]
                });
            }
        }
    }, [cvData.visibility, cvData.sectionOrder]);
    
    // Ensure sectionOrder is initialized in the parent or on load. 
    // For now, let's assume we handle it by checking if it exists in the render loop.

    const moveSection = (index: number, direction: number) => {
        const currentOrder = cvData.sectionOrder || Object.keys(cvData.visibility);
        const newOrder = [...currentOrder];
        
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= newOrder.length) return;

        [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];

        setCvData({
            ...cvData,
            sectionOrder: newOrder
        });
    };

    // Helper to check if template supports skill levels
    const supportsSkillLevels = ['midnight', 'slate', 'azure'].includes(currentTemplate);

    // Custom Sections Logic
    const addCustomSection = () => {
        setCvData({
            ...cvData,
            customSections: [
                ...(cvData.customSections || []),
                { id: Date.now(), title: 'New Section', items: [] }
            ]
        })
    }

    const removeCustomSection = (sectionId: number) => {
        setCvData({
            ...cvData,
            customSections: (cvData.customSections || []).filter(s => s.id !== sectionId)
        })
    }

    const updateCustomSectionTitle = (sectionId: number, title: string) => {
        setCvData({
            ...cvData,
            customSections: (cvData.customSections || []).map(s =>
                s.id === sectionId ? { ...s, title } : s
            )
        })
    }

    const addCustomSectionItem = (sectionId: number) => {
        setCvData({
            ...cvData,
            customSections: (cvData.customSections || []).map(s =>
                s.id === sectionId ? {
                    ...s,
                    items: [...s.items, { id: Date.now(), title: '', subtitle: '', date: '', description: '' }]
                } : s
            )
        })
    }

    const updateCustomSectionItem = (sectionId: number, itemId: number, field: keyof CustomSectionItem, value: string) => {
        setCvData({
            ...cvData,
            customSections: (cvData.customSections || []).map(s =>
                s.id === sectionId ? {
                    ...s,
                    items: s.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
                } : s
            )
        })
    }

    const removeCustomSectionItem = (sectionId: number, itemId: number) => {
        setCvData({
            ...cvData,
            customSections: (cvData.customSections || []).map(s =>
                s.id === sectionId ? {
                    ...s,
                    items: s.items.filter(i => i.id !== itemId)
                } : s
            )
        })
    }
    const handlePersonalInfoChange = (field: keyof Omit<PersonalInfo, 'customFields'>, value: string) => {
        setCvData({
            ...cvData,
            personalInfo: { ...cvData.personalInfo, [field]: value }
        })
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // 1. Read locally for immediate preview and CV data
            const reader = new FileReader()
            reader.onloadend = () => {
                handlePersonalInfoChange('photo', reader.result as string)
            }
            reader.readAsDataURL(file)

            // 2. Upload to backend for database storage
            try {
                const formData = new FormData();
                formData.append('file', file);
                await api.post('/auth/upload-photo', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("Photo uploaded to database successfully");
            } catch (error) {
                console.error("Failed to upload photo to database", error);
            }
        }
    }

    const addExperience = () => {
        setCvData({
            ...cvData,
            experience: [
                ...cvData.experience,
                {
                    id: Date.now(),
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    description: ''
                }
            ]
        })
    }

    const updateExperience = (id: number, field: keyof Experience, value: string) => {
        setCvData({
            ...cvData,
            experience: cvData.experience.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        })
    }

    const removeExperience = (id: number) => {
        setCvData({
            ...cvData,
            experience: cvData.experience.filter(exp => exp.id !== id)
        })
    }

    const addEducation = () => {
        setCvData({
            ...cvData,
            education: [
                ...cvData.education,
                {
                    id: Date.now(),
                    degree: '',
                    school: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    gpa: ''
                }
            ]
        })
    }

    const updateEducation = (id: number, field: keyof Education, value: string) => {
        setCvData({
            ...cvData,
            education: cvData.education.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        })
    }

    const removeEducation = (id: number) => {
        setCvData({
            ...cvData,
            education: cvData.education.filter(edu => edu.id !== id)
        })
    }

    const addSkill = () => {
        setCvData({
            ...cvData,
            skills: [
                ...cvData.skills,
                { id: Date.now(), name: '', level: 75, showLevel: true }
            ]
        })
    }

    const updateSkill = (id: number, field: keyof Skill, value: string | number | boolean) => {
        setCvData({
            ...cvData,
            skills: cvData.skills.map(skill =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        })
    }

    const removeSkill = (id: number) => {
        setCvData({
            ...cvData,
            skills: cvData.skills.filter(skill => skill.id !== id)
        })
    }

    // Interests
    const addInterest = () => {
        setCvData({
            ...cvData,
            interests: [...(cvData.interests || []), { id: Date.now(), name: '' }]
        })
    }

    const updateInterest = (id: number, value: string) => {
        setCvData({
            ...cvData,
            interests: (cvData.interests || []).map(int => int.id === id ? { ...int, name: value } : int)
        })
    }

    const removeInterest = (id: number) => {
        setCvData({
            ...cvData,
            interests: (cvData.interests || []).filter(int => int.id !== id)
        })
    }

    // Languages
    const addLanguage = () => {
        setCvData({
            ...cvData,
            languages: [...(cvData.languages || []), { id: Date.now(), name: '', proficiency: 'Novice/Beginner (A1)' }]
        })
    }

    const updateLanguage = (id: number, field: keyof Language, value: string) => {
        setCvData({
            ...cvData,
            languages: (cvData.languages || []).map(lang => lang.id === id ? { ...lang, [field]: value } : lang)
        })
    }

    const removeLanguage = (id: number) => {
        setCvData({
            ...cvData,
            languages: (cvData.languages || []).filter(lang => lang.id !== id)
        })
    }

    // Custom Fields
    const addCustomField = () => {
        setCvData({
            ...cvData,
            personalInfo: {
                ...cvData.personalInfo,
                customFields: [...(cvData.personalInfo.customFields || []), { id: Date.now().toString(), label: '', value: '', isUrl: false }]
            }
        })
    }

    const updateCustomField = (id: string, field: keyof CustomField, value: string | boolean) => {
        setCvData({
            ...cvData,
            personalInfo: {
                ...cvData.personalInfo,
                customFields: (cvData.personalInfo.customFields || []).map(cf => cf.id === id ? { ...cf, [field]: value } : cf)
            }
        })
    }

    const removeCustomField = (id: string) => {
        setCvData({
            ...cvData,
            personalInfo: {
                ...cvData.personalInfo,
                customFields: (cvData.personalInfo.customFields || []).filter(cf => cf.id !== id)
            }
        })
    }

    return (
        <div className="p-6 space-y-8">
            {/* Section Visibility and Reordering Control */}
            <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Section Visibility & Order</h3>
                <div className="space-y-2">
                    {(cvData.sectionOrder || Object.keys(cvData.visibility)).map((key, index) => {
                        // Ensure key exists in visibility (handle potential stale keys in order)
                        if (cvData.visibility[key] === undefined) return null;
                        
                        return (
                            <div key={key} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => toggleVisibility(key)}
                                        variant="ghost"
                                        icon={cvData.visibility[key] ? Eye : EyeOff}
                                        className={cvData.visibility[key] ? "text-blue-600" : "text-gray-400"}
                                    />
                                    <span className="capitalize font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button
                                        onClick={() => moveSection(index, -1)}
                                        variant="ghost"
                                        icon={ArrowUp}
                                        disabled={index === 0}
                                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                    />
                                    <Button
                                        onClick={() => moveSection(index, 1)}
                                        variant="ghost"
                                        icon={ArrowDown}
                                        disabled={index === (cvData.sectionOrder || Object.keys(cvData.visibility)).length - 1}
                                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Personal Info Section */}
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                    Personal Information
                </h2>

                {/* Photo Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {cvData.personalInfo.photo ? (
                            <>
                                <img
                                    src={cvData.personalInfo.photo}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                />
                                <Button
                                    onClick={() => handlePersonalInfoChange('photo', '')}
                                    variant="danger"
                                    icon={X}
                                >
                                    Remove Photo
                                </Button>
                            </>
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center text-gray-400">
                                <Upload size={24} />
                            </div>
                        )}
                        <div>
                            <Button
                                as="label"
                                htmlFor="photo-upload"
                                variant="primary"
                                color="blue"
                                icon={Upload}
                                className="cursor-pointer"
                            >
                                Upload Photo
                            </Button>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Input
                        placeholder="Full Name"
                        value={cvData.personalInfo.fullName}
                        onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                        color="blue"
                    />
                    <Input
                        placeholder="Professional Title"
                        value={cvData.personalInfo.title}
                        onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                        color="blue"
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={cvData.personalInfo.email}
                        onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                        color="blue"
                    />
                    <Input
                        type="tel"
                        placeholder="Phone"
                        value={cvData.personalInfo.phone}
                        onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                        color="blue"
                    />
                    <Input
                        placeholder="Location"
                        value={cvData.personalInfo.location}
                        onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                        color="blue"
                    />
                    <Input
                        placeholder="Website"
                        value={cvData.personalInfo.website || ''}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        color="blue"
                    />
                    <TextArea
                        placeholder="Professional Summary"
                        value={cvData.personalInfo.summary}
                        onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                        rows={4}
                        color="blue"
                    />

                    {/* Custom Fields */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Custom Fields</label>
                            <Button
                                onClick={addCustomField}
                                variant="text"
                                color="blue"
                                icon={Plus}
                                iconSize={14}
                            >
                                Add Field
                            </Button>
                        </div>
                        {(cvData.personalInfo.customFields || []).map(field => (
                            <div key={field.id} className="flex gap-2 items-center">
                                <Input
                                    placeholder="Label (e.g. LinkedIn)"
                                    value={field.label}
                                    onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                                    color="blue"
                                    className="w-1/3"
                                />
                                <Input
                                    placeholder="Value"
                                    value={field.value}
                                    onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                                    color="blue"
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => updateCustomField(field.id, 'isUrl', !field.isUrl)}
                                    variant="ghost"
                                    icon={Link}
                                    title={field.isUrl ? "Unlink" : "Make URL"}
                                    className={field.isUrl ? "text-blue-500" : "text-gray-400"}
                                />
                                <Button
                                    onClick={() => removeCustomField(field.id)}
                                    variant="ghost"
                                    icon={X}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            {cvData.visibility?.experience && (
                <section>
                    <SectionHeader
                        title="Experience"
                        color="green"
                        onAdd={addExperience}
                        addButtonLabel="Add Experience"
                    />

                    {cvData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 relative">
                            <Button
                                onClick={() => removeExperience(exp.id)}
                                variant="ghost"
                                icon={X}
                                className="absolute top-2 right-2"
                            />
                            <div className="grid grid-cols-1 gap-3">
                                <Input
                                    placeholder="Job Title"
                                    value={exp.title}
                                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                    color="green"
                                />
                                <Input
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                    color="green"
                                />
                                <Input
                                    placeholder="Location"
                                    value={exp.location}
                                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                    color="green"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="month"
                                        placeholder="Start Date"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        color="green"
                                    />
                                    <Input
                                        placeholder="End Date (or 'Present')"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                        color="green"
                                    />
                                </div>
                                <TextArea
                                    placeholder="Job Description"
                                    value={exp.description}
                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                    rows={3}
                                    color="green"
                                />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Education Section */}
            {cvData.visibility?.education && (
                <section>
                    <SectionHeader
                        title="Education"
                        color="purple"
                        onAdd={addEducation}
                        addButtonLabel="Add Education"
                    />

                    {cvData.education.map((edu) => (
                        <div key={edu.id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 relative">
                            <Button
                                onClick={() => removeEducation(edu.id)}
                                variant="ghost"
                                icon={X}
                                className="absolute top-2 right-2"
                            />
                            <div className="grid grid-cols-1 gap-3">
                                <Input
                                    placeholder="Degree"
                                    value={edu.degree}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                    color="purple"
                                />
                                <Input
                                    placeholder="School/University"
                                    value={edu.school}
                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                    color="purple"
                                />
                                <Input
                                    placeholder="Location"
                                    value={edu.location}
                                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                                    color="purple"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        type="month"
                                        placeholder="Start Date"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        color="purple"
                                    />
                                    <Input
                                        type="month"
                                        placeholder="End Date"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        color="purple"
                                    />
                                </div>
                                <Input
                                    placeholder="GPA (optional)"
                                    value={edu.gpa}
                                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                    color="purple"
                                />
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills Section */}
            {cvData.visibility?.skills && (
                <section>
                    <SectionHeader
                        title="Skills"
                        color="orange"
                        onAdd={addSkill}
                        addButtonLabel="Add Skill"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {cvData.skills.map((skill) => (
                            <div key={skill.id} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-white relative">
                                <Button
                                    onClick={() => removeSkill(skill.id)}
                                    variant="ghost"
                                    icon={X}
                                    className="absolute top-2 right-2"
                                />
                                <div className="pr-8">
                                    <Input
                                        placeholder="Skill Name"
                                        value={skill.name}
                                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                        color="orange"
                                        className="mb-2"
                                    />
                                </div>

                                {supportsSkillLevels && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 flex items-center gap-2">
                                            <span className="text-xs text-gray-500 w-12">Level: {skill.level || 75}%</span>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={skill.level || 75}
                                                onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                                disabled={skill.showLevel === false}
                                            />
                                        </div>
                                        <Button
                                            onClick={() => updateSkill(skill.id, 'showLevel', !skill.showLevel)}
                                            variant="ghost"
                                            icon={skill.showLevel !== false ? Eye : EyeOff}
                                            title={skill.showLevel !== false ? "Hide Level" : "Show Level"}
                                            className={skill.showLevel === false ? "text-gray-400" : "text-orange-500"}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Interests Section */}
            {cvData.visibility?.interests && (
                <section>
                    <SectionHeader
                        title="Interests"
                        color="pink"
                        onAdd={addInterest}
                        addButtonLabel="Add Interest"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(cvData.interests || []).map((interest) => (
                            <div key={interest.id} className="flex gap-2 items-center">
                                <Input
                                    placeholder="Interest"
                                    value={interest.name}
                                    onChange={(e) => updateInterest(interest.id, e.target.value)}
                                    color="pink"
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => removeInterest(interest.id)}
                                    variant="ghost"
                                    icon={X}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages Section */}
            {cvData.visibility?.languages && (
                <section>
                    <SectionHeader
                        title="Languages"
                        color="teal"
                        onAdd={addLanguage}
                        addButtonLabel="Add Language"
                    />

                    <div className="space-y-3">
                        {(cvData.languages || []).map((lang) => (
                            <div key={lang.id} className="flex gap-2 items-center">
                                <Input
                                    placeholder="Language"
                                    value={lang.name}
                                    onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                    color="teal"
                                    className="flex-1"
                                />
                                <Select
                                    placeholder="Proficiency"
                                    value={lang.proficiency}
                                    onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                                    options={[
                                        { value: 'Novice/Beginner (A1)', label: 'Novice/Beginner (A1)' },
                                        { value: 'Intermediate (B1)', label: 'Intermediate (B1)' },
                                        { value: 'Advanced (C1)', label: 'Advanced (C1)' },
                                        { value: 'Fluent', label: 'Fluent' },
                                        { value: 'Native', label: 'Native' }
                                    ]}
                                    color="teal"
                                    className="w-1/3"
                                />
                                <Button
                                    onClick={() => removeLanguage(lang.id)}
                                    variant="ghost"
                                    icon={X}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Custom Sections */}
            {cvData.visibility?.customSections && (
                <section>
                    <SectionHeader
                        title="Custom Sections"
                        color="indigo"
                        onAdd={addCustomSection}
                        addButtonLabel="Add Section"
                    />

                    <div className="space-y-6">
                        {(cvData.customSections || []).map((section) => (
                            <div key={section.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                                        className="text-lg font-bold bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none px-1"
                                        placeholder="Section Title"
                                    />
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => addCustomSectionItem(section.id)}
                                            variant="text"
                                            color="indigo"
                                            icon={Plus}
                                            iconSize={14}
                                        >
                                            Add Item
                                        </Button>
                                        <Button
                                            onClick={() => removeCustomSection(section.id)}
                                            variant="ghost"
                                            icon={Trash2}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {section.items.map((item) => (
                                        <div key={item.id} className="grid grid-cols-1 gap-3 p-3 bg-white rounded border border-gray-200 relative">
                                            <Button
                                                onClick={() => removeCustomSectionItem(section.id, item.id)}
                                                variant="ghost"
                                                icon={X}
                                                iconSize={16}
                                                className="absolute top-2 right-2"
                                            />
                                            <Input
                                                placeholder="Title / Role"
                                                value={item.title}
                                                onChange={(e) => updateCustomSectionItem(section.id, item.id, 'title', e.target.value)}
                                                color="indigo"
                                                className="text-sm"
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <Input
                                                    placeholder="Subtitle / Company"
                                                    value={item.subtitle}
                                                    onChange={(e) => updateCustomSectionItem(section.id, item.id, 'subtitle', e.target.value)}
                                                    color="indigo"
                                                    className="text-sm"
                                                />
                                                <Input
                                                    placeholder="Date / Duration"
                                                    value={item.date}
                                                    onChange={(e) => updateCustomSectionItem(section.id, item.id, 'date', e.target.value)}
                                                    color="indigo"
                                                    className="text-sm"
                                                />
                                            </div>
                                            <TextArea
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => updateCustomSectionItem(section.id, item.id, 'description', e.target.value)}
                                                rows={2}
                                                color="indigo"
                                                className="text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div >
    )
}
