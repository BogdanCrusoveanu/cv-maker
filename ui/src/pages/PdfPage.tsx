import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CvData } from '../types/cv';
import SlateTemplate from '../components/templates/Slate';
import ModernTemplate from '../components/templates/Modern';
import ClassicTemplate from '../components/templates/Classic';
import MinimalTemplate from '../components/templates/Minimal';
import NoirTemplate from '../components/templates/Noir';
import AzureTemplate from '../components/templates/Azure';
import CitrusTemplate from '../components/templates/Citrus';
import MidnightTemplate from '../components/templates/Midnight';

// This page is used for headless PDF generation via Puppeteer
// It uses a public endpoint that doesn't require authentication
export default function PdfPage() {
    const { id } = useParams<{ id: string }>();
    const [cvData, setCvData] = useState<CvData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchCv = async () => {
            try {
                const response = await fetch(`http://localhost:5140/api/cv/${id}/data`);
                if (!response.ok) {
                    throw new Error('Failed to fetch CV');
                }
                const data = await response.json();
                const parsedData = JSON.parse(data.data);
                setCvData(parsedData);
            } catch (err) {
                console.error('Error fetching CV:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCv();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (error || !cvData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-600">Failed to load CV</p>
            </div>
        );
    }

    const renderTemplate = () => {
        switch (cvData.template) {
            case 'modern':
                return <ModernTemplate cvData={cvData} />;
            case 'classic':
                return <ClassicTemplate cvData={cvData} />;
            case 'minimal':
                return <MinimalTemplate cvData={cvData} />;
            case 'noir':
                return <NoirTemplate cvData={cvData} />;
            case 'azure':
                return <AzureTemplate cvData={cvData} />;
            case 'citrus':
                return <CitrusTemplate cvData={cvData} />;
            case 'midnight':
                return <MidnightTemplate cvData={cvData} />;
            case 'slate':
            default:
                return <SlateTemplate cvData={cvData} />;
        }
    };

    return (
        <div className="w-[210mm] mx-auto bg-white">
            {renderTemplate()}
        </div>
    );
}
