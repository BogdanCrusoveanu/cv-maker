import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface ToastProps {
    id: string | number;
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: (id: string | number) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000); // Auto close after 5 seconds

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const bgColors: Record<string, string> = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200'
    };

    const textColors: Record<string, string> = {
        success: 'text-green-800',
        error: 'text-red-800',
        info: 'text-blue-800'
    };

    const icons: Record<string, React.ReactNode> = {
        success: <CheckCircle size={20} className="text-green-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <AlertCircle size={20} className="text-blue-500" />
    };

    return (
        <div className={`flex items-center p-4 mb-3 rounded-lg border shadow-md transition-all duration-300 transform translate-x-0 ${bgColors[type] || bgColors.info} min-w-[300px]`}>
            <div className="mr-3">
                {icons[type] || icons.info}
            </div>
            <div className={`flex-grow font-medium ${textColors[type] || textColors.info}`}>
                {message}
            </div>
            <button
                onClick={() => onClose(id)}
                className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <X size={18} />
            </button>
        </div>
    );
};
