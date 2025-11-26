export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: number;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    gpa: string;
}

export interface Skill {
    id: number;
    name: string;
    level?: number;
    showLevel?: boolean;
}

export interface Interest {
    id: number;
    name: string;
}

export interface Language {
    id: number;
    name: string;
    proficiency: string;
}

export interface CustomField {
    id: string;
    label: string;
    value: string;
    isUrl?: boolean;
}

export interface CustomSectionItem {
    id: number;
    title: string;
    subtitle: string;
    date: string;
    description: string;
}

export interface CustomSection {
    id: number;
    title: string;
    items: CustomSectionItem[];
}

export interface PersonalInfo {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    summary: string;
    photo?: string;
    customFields?: CustomField[];
}

export interface Visibility {
    experience: boolean;
    education: boolean;
    skills: boolean;
    interests: boolean;
    languages: boolean;
    customSections: boolean;
    personalInfo: boolean;
    summary: boolean;
    [key: string]: boolean;
}

export interface CvData {
    id?: number;
    title?: string;
    personalInfo: PersonalInfo;
    experience: Experience[];
    education: Education[];
    skills: Skill[];
    interests?: Interest[];
    languages?: Language[];
    customSections?: CustomSection[];
    sectionOrder?: string[];
    visibility: Visibility;
    template?: string;
    publicToken?: string;
    data?: any; // For the backend wrapper structure
}

export interface CvBackendResponse {
    id: number;
    title: string;
    data: string; // JSON string
    userId: number;
    createdAt: string;
    updatedAt: string;
    publicToken?: string;
}
