
import React from 'react';

interface InputGroupProps {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, children, htmlFor }) => (
    <div className="mb-4">
        <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium text-slate-300">
            {label}
        </label>
        {children}
    </div>
);
