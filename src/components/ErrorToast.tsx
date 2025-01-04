import React, { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorToastProps {
    message: string | null;
    isOpen: boolean;
    onClose: () => void;
    duration?: number; // Duration in milliseconds
}

const ErrorToast: React.FC<ErrorToastProps> = ({
    message,
    isOpen,
    onClose,
    duration = 3000 // Default 3 seconds
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                OnClose();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const OnClose = () => {
        isOpen = false;
        onClose()
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
            <Alert variant="destructive" className="w-72 pr-8">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className='text-red-500'>{message}</AlertDescription>
                <button
                    onClick={OnClose}
                    className="absolute right-2 top-2 rounded-lg p-1 hover:text-red-800 transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </Alert>
        </div>
    );
};

export default ErrorToast;