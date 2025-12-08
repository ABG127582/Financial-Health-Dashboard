
import React, { useEffect } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 border border-slate-700 transform transition-transform duration-300 scale-95 animate-modal-enter"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-slate-400 hover:text-white transition-colors text-2xl"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>
                <div>{children}</div>
            </div>
            <style>{`
                @keyframes modal-enter {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-modal-enter {
                    animation: modal-enter 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
