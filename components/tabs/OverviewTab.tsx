
import React, { useMemo } from 'react';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput } from '../common';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { WalletIcon, ScaleIcon, AllocationIcon } from '../../constants';
import { formatCurrency } from '../../utils/formatting';
import { calculateFinancialMetrics } from '../../utils/analytics';
import { NetWorthChart, IncomeDistributionChart } from '../charts/OverviewCharts';

interface StatCardProps {
    label: string;
    value: string;
    gradient: string;
    subtext?: string;
}
const StatCard: React.FC<StatCardProps> = ({ label, value, gradient, subtext }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${gradient} transition-transform hover:-translate-y-1`}>
        <div className="relative z-10">
            <div className="text-sm font-medium opacity-90 mb-1">{label}</div>
            <div className="text-3xl font-bold">{value}</div>
            {subtext && <div className="text-xs opacity-75 mt-1">{subtext}</div>}
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
    </div>
);

export const OverviewTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();

    const metrics = useMemo(() => calculateFinancialMetrics(financialData), [financialData]);

    const { 
        score, 
        emergencyMonths, 
        debtRatio, 
        savingsRate, 
        netWorth, 
        totalAssets, 
        totalLiabilities,
        totalDebtPayments,
        monthlyGain
    } = metrics;

    const updateFinancialData = (key: 'income', value: number) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { key, value } });
    }

    return (
        <>
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    label="Score de Saúde" 
                    value={`${financialData.income > 0 ? score : '--'}/100`} 
                    gradient={score > 70 ? "from-green-500 to-emerald-600" : score > 40 ? "from-yellow-500 to-orange-500" : "from-red-500 to-pink-600"} 
                />
                <StatCard 
                    label="Reserva de Emergência" 
                    value={`${emergencyMonths.toFixed(1)} meses`} 
                    gradient="from-blue-500 to-cyan-500"
                    subtext={`Meta: ${formatCurrency(metrics.emergencyTarget)}`}
                />
                <StatCard 
                    label="Comprometimento" 
                    value={`${debtRatio.toFixed(0)}%`} 
                    gradient={debtRatio > 30 ? "from-red-500 to-orange-500" : "from-indigo-500 to-purple-500"}
                    subtext="Renda gasta com dívidas"
                />
                <StatCard 
                    label="Taxa de Poupança" 
                    value={`${savingsRate.toFixed(0)}%`} 
                    gradient={savingsRate > 15 ? "from-teal-400 to-green-500" : "from-slate-600 to-slate-500"}
                    subtext="Meta ideal: 20%+"
                />
            </div>

            {/* Chart Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                 <Card icon={<ScaleIcon />} title="Patrimônio Líquido" subtitle="Balanço: Ativos (O que tenho) vs. Passivos (O que devo)">
                    <div className="flex justify-between items-end mb-4 px-2">
                        <div>
                            <p className="text-slate-400 text-sm">Resultado Líquido</p>
                            <div className={`text-3xl font-bold ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {formatCurrency(netWorth)}
                            </div>
                        </div>
                        <div className="text-right text-xs text-slate-500">
                            Ativos: {formatCurrency(totalAssets)}<br/>
                            Passivos: {formatCurrency(totalLiabilities)}
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                        <NetWorthChart assets={totalAssets} liabilities={totalLiabilities} />
                    </div>
                </Card>

                <Card icon={<AllocationIcon />} title="Distribuição Real" subtitle="Para onde seu dinheiro está indo este mês">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-xs text-slate-400 uppercase">Renda Mensal</p>
                            <p className="text-xl font-semibold text-white">{formatCurrency(monthlyGain)}</p>
                        </div>
                        <div className="bg-slate-700/30 p-3 rounded-lg">
                            <p className="text-xs text-slate-400 uppercase">Total Comprometido</p>
                            <p className="text-xl font-semibold text-white">{formatCurrency(financialData.allocation.currentEssential + financialData.allocation.currentEnjoy + financialData.allocation.currentInvestment + totalDebtPayments)}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 relative">
                        <IncomeDistributionChart 
                            essential={financialData.allocation.currentEssential}
                            lifestyle={financialData.allocation.currentEnjoy}
                            investments={financialData.allocation.currentInvestment}
                            debts={totalDebtPayments}
                        />
                        {monthlyGain === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-xl">
                                <p className="text-slate-300 text-sm">Defina sua renda abaixo</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Controls Row */}
            <div className="grid grid-cols-1 gap-6 mb-8">
                <Card icon={<WalletIcon />} title="Controle de Fluxo" subtitle="Atualize sua renda base para recalcular as metas">
                     <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <InputGroup label="💰 Renda Mensal Líquida (R$)">
                                <StyledInput
                                    type="number"
                                    id="totalIncome"
                                    placeholder="Ex: 5000"
                                    value={financialData.income || ''}
                                    onChange={(e) => updateFinancialData('income', parseFloat(e.target.value) || 0)}
                                />
                            </InputGroup>
                        </div>
                        <div className="hidden md:block pb-4 text-slate-500 text-sm max-w-md">
                            Mantenha este valor atualizado. Todas as regras (50-15-35, Investimentos, Dívidas) são baseadas na sua renda líquida.
                        </div>
                     </div>
                </Card>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800 to-indigo-900/40 p-6 rounded-2xl border border-slate-700">
                <h3 className="font-bold text-lg mb-3 text-white">🚀 Regras de Ouro</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-sm">
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Anote tudo: Ganho, Gasto e Investimento.</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Reserva: 6x salário (CLT) ou 3x (Concursado).</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Regra 50-15-35: Essencial, Investir, Lazer.</li>
                    <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Trocas: Guarde 5% dos essenciais para bens.</li>
                </ul>
            </div>
        </>
    );
};
