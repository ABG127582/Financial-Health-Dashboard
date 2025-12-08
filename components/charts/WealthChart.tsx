
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatCurrency } from '../../utils/formatting';

// Register all necessary components for the line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WealthChartProps {
    monthlyContribution: number;
    initialAmount: number;
    years: number;
    interestRate: number;
}

export const WealthChart: React.FC<WealthChartProps> = ({ monthlyContribution, initialAmount, years, interestRate }) => {
    const labels = [];
    const dataPoints = [];
    const totalInvestedPoints = [];
    
    // Safety fallback
    const safeMonthly = monthlyContribution || 0;
    const safeInitial = initialAmount || 0;
    const safeYears = years || 1;
    const safeRate = interestRate || 0;

    let currentAmount = safeInitial;
    let totalInvested = safeInitial;
    const monthlyRate = safeRate / 100 / 12;

    for (let year = 0; year <= safeYears; year++) {
        labels.push(`Ano ${year}`);
        dataPoints.push(currentAmount);
        totalInvestedPoints.push(totalInvested);

        if (year < safeYears) {
            for (let month = 0; month < 12; month++) {
                currentAmount = currentAmount * (1 + monthlyRate) + safeMonthly;
                totalInvested += safeMonthly;
            }
        }
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Patrimônio Total (Com Juros)',
                data: dataPoints,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Total Aportado (Do seu bolso)',
                data: totalInvestedPoints,
                borderColor: 'rgba(99, 102, 241, 0.8)',
                backgroundColor: 'transparent',
                borderDash: [5, 5],
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: { color: '#94a3b8', family: 'Inter, sans-serif' }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                },
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: '#334155',
                borderWidth: 1,
            },
            title: {
                display: true,
                text: `Projeção em ${safeYears} Anos`,
                color: '#fff'
            }
        },
        scales: {
            y: {
                grid: { color: '#334155' },
                ticks: { color: '#94a3b8', callback: (value: any) => 'R$' + (value / 1000) + 'k' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#94a3b8' }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return <div className="h-72 w-full"><Line data={data} options={options} /></div>;
};
