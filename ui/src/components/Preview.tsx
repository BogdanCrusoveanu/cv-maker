import ModernTemplate from './templates/Modern'
import ClassicTemplate from './templates/Classic'
import MinimalTemplate from './templates/Minimal'
import NoirTemplate from './templates/Noir'
import AzureTemplate from './templates/Azure'
import SlateTemplate from './templates/Slate'
import CitrusTemplate from './templates/Citrus'
import MidnightTemplate from './templates/Midnight'
import { CvData } from '../types/cv';

interface PreviewProps {
    cvData: CvData;
    template: string;
}

export default function Preview({ cvData, template }: PreviewProps) {
    const templates = {
        modern: ModernTemplate,
        classic: ClassicTemplate,
        minimal: MinimalTemplate,
        noir: NoirTemplate,
        azure: AzureTemplate,
        slate: SlateTemplate,
        citrus: CitrusTemplate,
        midnight: MidnightTemplate
    }

    const TemplateComponent = templates[template as keyof typeof templates] || ModernTemplate

    return (
        <div className="bg-white shadow-2xl mx-auto cv-template">
            <TemplateComponent cvData={cvData} />
        </div>
    )
}
