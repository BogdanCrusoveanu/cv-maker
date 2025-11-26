import React from 'react';

interface CvPreviewProps {
    template?: string;
}

export const CvPreview: React.FC<CvPreviewProps> = ({ template = 'modern' }) => {
    const getPreview = () => {
        switch (template) {
            case 'modern':
                return (
                    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
                        <div className="h-2 w-full bg-red-500"></div>
                        <div className="flex flex-1 p-2 gap-2">
                            <div className="w-1/3 flex flex-col gap-1">
                                <div className="h-8 w-8 bg-gray-200 rounded-full mb-1"></div>
                                <div className="h-1 w-full bg-gray-200 rounded"></div>
                                <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                                <div className="mt-2 h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                            </div>
                            <div className="w-2/3 flex flex-col gap-1">
                                <div className="h-2 w-1/2 bg-gray-800 rounded mb-1"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                                <div className="mt-2 h-1.5 w-1/3 bg-gray-300 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                );
            case 'classic':
                return (
                    <div className="w-full h-full bg-white flex flex-col p-2 relative overflow-hidden">
                        <div className="flex flex-col items-center mb-2 border-b border-purple-200 pb-1">
                            <div className="h-2 w-1/2 bg-purple-600 rounded mb-1"></div>
                            <div className="h-1 w-1/3 bg-gray-400 rounded"></div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="h-1.5 w-1/4 bg-purple-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="mt-1 h-1.5 w-1/4 bg-purple-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                );
            case 'minimal':
                return (
                    <div className="w-full h-full bg-white flex flex-col p-3 relative overflow-hidden">
                        <div className="h-3 w-1/2 bg-yellow-500 mb-2"></div>
                        <div className="flex gap-2">
                            <div className="w-2/3 flex flex-col gap-1">
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                                <div className="mt-2 h-1.5 w-1/3 bg-gray-800 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                );
            case 'noir':
                return (
                    <div className="w-full h-full bg-white flex relative overflow-hidden">
                        <div className="w-1/3 bg-gray-900 h-full p-2 flex flex-col gap-2">
                            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                            <div className="h-1 w-full bg-gray-700 rounded"></div>
                            <div className="h-1 w-3/4 bg-gray-700 rounded"></div>
                            <div className="mt-2 h-0.5 w-full bg-gray-700 rounded"></div>
                            <div className="h-0.5 w-full bg-gray-700 rounded"></div>
                        </div>
                        <div className="w-2/3 p-2 flex flex-col gap-1">
                            <div className="h-3 w-3/4 bg-gray-900 mb-2"></div>
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                            <div className="h-1 w-3/4 bg-gray-200 rounded"></div>
                            <div className="mt-2 h-1.5 w-1/3 bg-gray-400 rounded"></div>
                            <div className="h-1 w-full bg-gray-200 rounded"></div>
                        </div>
                    </div>
                );
            case 'azure':
                return (
                    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
                        <div className="h-8 w-full bg-blue-600 mb-2 flex items-center px-2">
                            <div className="h-2 w-1/2 bg-white/50 rounded"></div>
                        </div>
                        <div className="flex-1 px-2 flex flex-col gap-1">
                            <div className="h-1.5 w-1/3 bg-blue-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="mt-2 h-1.5 w-1/3 bg-blue-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                        </div>
                    </div>
                );
            case 'slate':
                return (
                    <div className="w-full h-full bg-white flex relative overflow-hidden">
                        <div className="w-1/4 bg-slate-200 h-full p-1 flex flex-col gap-1">
                             <div className="h-4 w-4 bg-slate-400 rounded-full mx-auto mb-1"></div>
                             <div className="h-0.5 w-full bg-slate-300 rounded"></div>
                             <div className="h-0.5 w-full bg-slate-300 rounded"></div>
                        </div>
                        <div className="w-3/4 p-2 flex flex-col gap-1">
                            <div className="h-2 w-1/2 bg-slate-700 rounded mb-1"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="mt-1 h-1.5 w-1/3 bg-slate-200 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                        </div>
                    </div>
                );
            case 'citrus':
                return (
                    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden p-2">
                        <div className="flex justify-between items-start mb-2">
                            <div className="h-3 w-1/2 bg-yellow-400 rounded"></div>
                            <div className="h-6 w-6 bg-yellow-100 rounded-full"></div>
                        </div>
                        <div className="h-1 w-full bg-yellow-50 rounded mb-2"></div>
                        <div className="flex flex-col gap-1">
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                            <div className="h-1 w-3/4 bg-gray-100 rounded"></div>
                            <div className="mt-1 h-1.5 w-1/4 bg-yellow-100 rounded"></div>
                            <div className="h-1 w-full bg-gray-100 rounded"></div>
                        </div>
                    </div>
                );
            case 'midnight':
                return (
                    <div className="w-full h-full bg-slate-900 flex flex-col p-2 relative overflow-hidden">
                        <div className="h-2 w-1/2 bg-indigo-400 rounded mb-2"></div>
                        <div className="h-0.5 w-full bg-slate-700 rounded mb-2"></div>
                        <div className="flex flex-col gap-1">
                            <div className="h-1 w-full bg-slate-800 rounded"></div>
                            <div className="h-1 w-full bg-slate-800 rounded"></div>
                            <div className="h-1 w-3/4 bg-slate-800 rounded"></div>
                            <div className="mt-2 h-1.5 w-1/3 bg-indigo-900 rounded"></div>
                            <div className="h-1 w-full bg-slate-800 rounded"></div>
                        </div>
                    </div>
                );
            default:
                // Default to modern if unknown
                return (
                    <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
                        <div className="h-2 w-full bg-gray-200"></div>
                        <div className="flex flex-1 p-2 gap-2">
                            <div className="w-1/3 flex flex-col gap-1">
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                            </div>
                            <div className="w-2/3 flex flex-col gap-1">
                                <div className="h-2 w-1/2 bg-gray-300 rounded mb-1"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                                <div className="h-1 w-full bg-gray-100 rounded"></div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full h-full shadow-sm overflow-hidden border border-gray-100">
            {getPreview()}
        </div>
    );
};
