
import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title
} from 'chart.js';
import type { TooltipItem } from 'chart.js';
import { formatCurrency } from '../../utils/formatting';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: { color: '#94a3b8', family: 'Inter', padding: 20 }
        }
    }
};

export const NetWorthChart: React.FC<{ assets: number; liabilities: number }> = ({ assets, liabilities }) => {
    const data = {
        labels: ['Ativos (Bens)', 'Passivos (Dívidas)'],
        datasets: [
            {
                label: 'Valor Total',
                data: [assets, liabilities],
                backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const options = {
        ...commonOptions,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => formatCurrency(context.raw)
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8', callback: (value: any) => 'R$' + (value / 1000) + 'k' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#cbd5e1', font: { weight: 'bold' as const } }
            }
        }
    };

    return <div className="h-64"><Bar data={data} options={options} /></div>;
};

export const IncomeDistributionChart: React.FC<{ 
    essential: number; 
    lifestyle: number; 
    investments: number; 
    debts: number 
}> = ({ essential, lifestyle, investments, debts }) => {
    const data = {
        labels: ['Essenciais', 'Lazer', 'Investimentos', 'Dívidas'],
        datasets: [
            {
                data: [essential, lifestyle, investments, debts],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',  // Amber (Essential)
                    'rgba(139, 92, 246, 0.8)',  // Violet (Lifestyle)
                    'rgba(16, 185, 129, 0.8)',  // Emerald (Invest)
                    'rgba(239, 68, 68, 0.8)',   // Red (Debt)
                ],
                borderColor: '#1e293b',
                borderWidth: 2,
            },
        ],
    };

    const options = {
        ...commonOptions,
        plugins: {
            ...commonOptions.plugins,
            tooltip: {
                callbacks: {
                    label: (context: TooltipItem<'doughnut'>) => {
                        const value = context.raw as number;
                        // Cast to number[] to handle Chart.js data types safely
                        const datasetData = context.dataset.data as number[];
                        const total = datasetData.reduce((a: number, b: number) => a + b, 0);
                        const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
                        return `${context.label}: ${formatCurrency(value)} (${pct}%)`;
                    }
                }
            }
        }
    };

    return <div className="h-64"><Doughnut data={data} options={options} /></div>;
};
