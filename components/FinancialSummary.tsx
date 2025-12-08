
import React, { useMemo } from 'react';
import { useFinancialData } from '../context';
import { calculateFinancialMetrics } from '../utils/analytics';

export const FinancialSummary: React.FC = () => {
    const financialData = useFinancialData();

    const { score, advice, actions } = useMemo(() => {
        const metrics = calculateFinancialMetrics(financialData);
        const { score, debtRatio, emergencyMonths, savingsRate, emergencyTarget } = metrics;
        const { income, allocation, debts, investments } = financialData;

        if (income <= 0) {
            return {
                score: 0,
                advice: 'Preencha sua Renda Mensal na aba "Visão Geral" para começar!',
                actions: []
            };
        }
        
        let currentAdvice = 'Preencha seus dados para uma análise completa!';
        if (score >= 85) currentAdvice = '🌟 Excelente! Sua saúde financeira está robusta. Foque em aumentar seu patrimônio e diversificar.';
        else if (score >= 70) currentAdvice = '👍 Muito bom! Você está no controle, mas ajuste alguns ponteiros para atingir a excelência.';
        else if (score >= 50) currentAdvice = '⚠️ Atenção! Existem pontos de vulnerabilidade. Priorize quitar dívidas ou montar a reserva.';
        else currentAdvice = '🚨 Alerta Vermelho! Sua estabilidade está em risco. É hora de cortar gastos e renegociar dívidas.';

        const currentActions = [];
        // Emergency Logic
        const emergencyPercent = emergencyTarget > 0 ? (financialData.emergency.current / emergencyTarget) : 0;
        if (emergencyPercent < 1) {
            currentActions.push(`🛡️ Complete sua Reserva de Emergência. Você tem ${emergencyMonths.toFixed(1)} meses cobertos, o ideal é chegar a ${(emergencyTarget/financialData.grossSalary || 6).toFixed(0)}.`);
        }

        // Debt Logic
        if (debtRatio > 30) {
            currentActions.push(`💳 Crítico: ${debtRatio.toFixed(0)}% da sua renda vai para dívidas. O teto seguro é 30%. Tente renegociar ou usar renda extra.`);
        } else if (debts.some(d => d.interest > 2)) {
            currentActions.push('🔥 Ataque as dívidas com juros altos (>2% a.m.) primeiro. Elas destroem seu patrimônio.');
        }

        // Investing Logic
        if (savingsRate < 15) {
            currentActions.push(`📈 Aumente seus aportes. Você investe ${savingsRate.toFixed(1)}% da renda, a meta da riqueza é 15-20%.`);
        }
        
        // Spending Logic
        const essentialRatio = allocation.currentEssential / income;
        if (essentialRatio > 0.55) {
             currentActions.push(`💸 Seus gastos essenciais consomem ${(essentialRatio*100).toFixed(0)}% da renda. Tente reduzir custos fixos para chegar a 50%.`);
        }

        return { score, advice: currentAdvice, actions: currentActions };
    }, [financialData]);

    return (
        <div className="mt-8 text-center bg-gradient-to-br from-slate-800 to-indigo-900/70 rounded-3xl p-8 md:p-12 border border-slate-700 shadow-2xl">
            <div className="inline-block p-3 rounded-full bg-slate-700/50 mb-4 border border-slate-600">
                 <span className="text-2xl font-bold text-white">{score}</span>
                 <span className="text-slate-400 text-sm"> / 100 pontos</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Diagnóstico Financeiro</h2>
            <p className="text-indigo-200 text-lg mb-6 font-medium">{advice}</p>
            {financialData.income > 0 && actions.length > 0 && (
                <div className="mt-6 text-left max-w-3xl mx-auto space-y-3 animate-fade-in-up">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Plano de Ação Sugerido</h3>
                    {actions.map((action, index) => (
                        <div key={index} className="flex items-start gap-3 bg-slate-800/80 p-4 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                            <span className="text-xl mt-0.5">{action.split(' ')[0]}</span>
                            <span className="text-slate-300 text-sm md:text-base">{action.substring(action.indexOf(' ') + 1)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
