
import React from 'react';

interface CardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ icon, title, subtitle, children, className }) => (
    <div className={`bg-slate-800/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-700 shadow-lg mb-6 transition-transform duration-300 hover:-translate-y-1 ${className}`}>
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-700">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl shadow-md">
                {icon}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-100">{title}</h2>
                <p className="text-sm text-slate-400">{subtitle}</p>
            </div>
        </div>
        <div>{children}</div>
    </div>
);
