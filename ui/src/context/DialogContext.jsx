import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';

const DialogContext = createContext(null);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider = ({ children }) => {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    });

    const confirm = useCallback(({ title, message }) => {
        return new Promise((resolve) => {
            setDialogState({
                isOpen: true,
                title,
                message,
                onConfirm: () => {
                    setDialogState((prev) => ({ ...prev, isOpen: false }));
                    resolve(true);
                },
                onCancel: () => {
                    setDialogState((prev) => ({ ...prev, isOpen: false }));
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <DialogContext.Provider value={{ confirm }}>
            {children}
            <ConfirmationDialog
                isOpen={dialogState.isOpen}
                title={dialogState.title}
                message={dialogState.message}
                onConfirm={dialogState.onConfirm}
                onCancel={dialogState.onCancel}
            />
        </DialogContext.Provider>
    );
};
