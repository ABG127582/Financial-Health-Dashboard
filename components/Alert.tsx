
import React from 'react';

interface AlertProps {
    type: 'success' | 'warning' | 'danger' | 'info';
    children: React.ReactNode;
    className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type, children, className }) => {
    const baseClasses = 'border-l-4 rounded-r-lg p-4 my-2 text-sm font-medium shadow-md';
    
    const typeClasses = {
        success: 'bg-green-900/50 border-green-500 text-green-200',
        warning: 'bg-yellow-900/50 border-yellow-500 text-yellow-200',
        danger: 'bg-red-900/50 border-red-500 text-red-200',
        info: 'bg-blue-900/50 border-blue-500 text-blue-200',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
            {children}
        </div>
    );
};
