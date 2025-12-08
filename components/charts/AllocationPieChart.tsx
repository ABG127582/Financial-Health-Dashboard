
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import type { TooltipItem } from 'chart.js';
import type { Investment } from '../../types';
import { formatCurrency } from '../../utils/formatting';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface AllocationPieChartProps {
    investments: Investment[];
}

export const AllocationPieChart: React.FC<AllocationPieChartProps> = ({ investments }) => {
    if (!investments || investments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-80 text-slate-400 bg-slate-800/30 rounded-lg border border-slate-700 border-dashed">
                <div className="text-4xl mb-2">📊</div>
                <p>Adicione investimentos para ver a distribuição.</p>
            </div>
        );
    }

    const aggregatedData = investments.reduce((acc: Record<string, number>, investment: Investment) => {
        const typeLabel = investment.type ? (investment.type.charAt(0).toUpperCase() + investment.type.slice(1)) : 'Outros';
        if (!acc[typeLabel]) {
            acc[typeLabel] = 0;
        }
        acc[typeLabel] += Number(investment.amount) || 0;
        return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(aggregatedData);
    const dataValues = Object.values(aggregatedData);

    const data = {
        labels,
        datasets: [{
            label: 'Valor Investido (R$)',
            data: dataValues,
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',   // Blue
                'rgba(16, 185, 129, 0.8)',  // Emerald
                'rgba(239, 68, 68, 0.8)',   // Red
                'rgba(245, 158, 11, 0.8)',  // Amber
                'rgba(139, 92, 246, 0.8)',  // Violet
                'rgba(236, 72, 153, 0.8)',  // Pink
                'rgba(99, 102, 241, 0.8)',  // Indigo
                'rgba(14, 165, 233, 0.8)',  // Sky
            ],
            borderColor: '#1e293b', // Slate 800 matching bg
            borderWidth: 2,
        }],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: '#94a3b8', // Slate 400
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: 'Inter, sans-serif'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function(context: TooltipItem<'pie'>) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const dataset = context.dataset;
                        // Robustly handle data summing with explicit type checking
                        const total = dataset.data.reduce((acc: number, current) => acc + (typeof current === 'number' ? current : 0), 0) || 1;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                    }
                }
            }
        },
    };

    return <div className="h-80 p-2"><Pie data={data} options={options} /></div>;
};
