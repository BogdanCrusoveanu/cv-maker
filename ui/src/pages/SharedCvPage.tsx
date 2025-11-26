import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, UserPlus } from 'lucide-react';
import api from '../services/api';
import Preview from '../components/Preview';
import { Button } from '../components/ui/Button';
import { CvData } from '../types/cv';

export default function SharedCvPage() {
    const { token } = useParams<{ token: string }>();
    const [cv, setCv] = useState<CvData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedCv = async () => {
            try {
                if (!token) return;
                const response = await api.getSharedCv(token);
                // The API returns { title, data, updatedAt }. data is a JSON string.
                const parsedData = JSON.parse(response.data.data);
                setCv({
                    ...parsedData,
                    title: response.data.title,
                    updatedAt: response.data.updatedAt
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load CV. It might be invalid or unshared.');
            } finally {
                setLoading(false);
            }
        };

        fetchSharedCv();
    }, [token]);

    const handleDownload = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !cv) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">CV Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || 'The CV you are looking for does not exist or is no longer shared.'}</p>
                    <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header for actions */}
            <div className="bg-white shadow-sm p-4 print:hidden sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <h1 className="text-xl font-bold text-gray-800 truncate max-w-xs" title={cv.title}>{cv.title}</h1>
                         <span className="text-sm text-gray-500 hidden sm:inline">by {cv.personalInfo?.fullName || 'Unknown'}</span>
                    </div>
                    <Button onClick={handleDownload} icon={Download} variant="primary">
                        Download PDF
                    </Button>
                </div>
            </div>

            {/* CV Preview */}
            <div className="flex-grow p-4 md:p-8 overflow-auto print:p-0 print:overflow-visible">
                <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:w-full">
                    <Preview cvData={cv} template={cv.template || 'modern'} />
                </div>
            </div>

            {/* Floating Sign-up Message */}
            <div className="fixed bottom-6 right-6 z-50 print:hidden animate-slide-in-right">
                <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-2xl flex flex-col gap-3 max-w-xs relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-full shrink-0">
                            <UserPlus className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Build your own CV</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Like this CV? Create your own professional resume in minutes for free.
                            </p>
                        </div>
                    </div>
                    <Link to="/register" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                            Get Started
                        </Button>
                    </Link>
                    <button 
                        onClick={(e) => e.currentTarget.parentElement?.remove()} 
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        title="Dismiss"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
