import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';

interface DialogContextType {
    confirm: (options: { title: string; message: string }) => Promise<boolean>;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        onCancel: () => { }
    });

    const confirm = useCallback(({ title, message }: { title: string; message: string }) => {
        return new Promise<boolean>((resolve) => {
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
