import React from 'react';
import { Button } from './Button';

export const ConfirmationDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all scale-100">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        variant="danger"
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </div>
    );
};
