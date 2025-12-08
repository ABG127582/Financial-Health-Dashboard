
import React from 'react';

export const commonInputClasses = "w-full bg-slate-700 border-2 border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

export const StyledInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={commonInputClasses} />
);

export const StyledSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={commonInputClasses}>
        {props.children}
    </select>
);

export const PrimaryButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        {...props}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
        {props.children}
    </button>
);

export const DangerButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
     <button
        {...props}
        className="bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-sm hover:bg-red-700 transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500"
    >
        {props.children}
    </button>
);

// FIX: Changed ItemCard to be a React.FC to allow the 'key' prop when used in lists.
export const ItemCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 mb-3">
        {children}
    </div>
);
