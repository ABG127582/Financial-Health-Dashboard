
import React from 'react';

interface ProgressBarProps {
    progress: number;
    color?: string;
    height?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'from-green-500 to-teal-500', height = 'h-3' }) => (
    <div className={`w-full bg-slate-700 rounded-full ${height} overflow-hidden shadow-inner`}>
        <div
            className={`bg-gradient-to-r ${color} h-full rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
    </div>
);
