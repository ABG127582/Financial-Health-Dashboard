
import React, { useState, useMemo, useEffect } from 'react';
import type { Investment } from '../../types';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput, StyledSelect, PrimaryButton, DangerButton, ItemCard } from '../common';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { formatCurrency } from '../../utils/formatting';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { InvestmentsIcon, DiamondIcon } from '../../constants';
import { AllocationPieChart } from '../charts/AllocationPieChart';
import { WealthChart } from '../charts/WealthChart';

export const InvestmentsTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();
    const { investments, allocation } = financialData;

    const [isModalOpen, setModalOpen] = useState(false);
    const [newInvestment, setNewInvestment] = useState({ type: 'rendaFixa', amount: '', returnRate: '' });

    // Wealth Simulator State
    // Initialize with defaults
    const [simYears, setSimYears] = useState(10);
    const [simRate, setSimRate] = useState(10); // 10% per year
    const [simMonthly, setSimMonthly] = useState(allocation.currentInvestment || 500);

    // Update simMonthly if allocation changes significantly
    useEffect(() => {
        if (allocation.currentInvestment > 0) {
            setSimMonthly(allocation.currentInvestment);
        }
    }, [allocation.currentInvestment]);

    const handleAddInvestment = () => {
        if (!newInvestment.amount) return;
        const investment: Investment = {
            id: Date.now(),
            type: newInvestment.type,
            amount: parseFloat(newInvestment.amount),
            returnRate: parseFloat(newInvestment.returnRate) || 0,
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'investments', item: investment } });
        setNewInvestment({ type: 'rendaFixa', amount: '', returnRate: '' });
        setModalOpen(false);
    };

    const handleRemoveInvestment = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'investments', id } });
    };

    const totalInvested = useMemo(() => investments.reduce((sum, item) => sum + item.amount, 0), [investments]);

    return (
        <>
             <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Investimento">
                <InputGroup label="Tipo de Investimento">
                    <StyledSelect value={newInvestment.type} onChange={(e) => setNewInvestment({...newInvestment, type: e.target.value})}>
                        <option value="rendaFixa">Renda Fixa (CDB, Tesouro)</option>
                        <option value="acoes">Ações / Stocks</option>
                        <option value="fiis">Fundos Imobiliários (FIIs)</option>
                        <option value="crypto">Criptomoedas</option>
                        <option value="etf">ETFs</option>
                        <option value="fundos">Fundos de Investimento</option>
                        <option value="outro">Outro</option>
                    </StyledSelect>
                </InputGroup>
                <InputGroup label="Valor Atual (R$)">
                    <StyledInput type="number" placeholder="Ex: 5000" value={newInvestment.amount} onChange={(e) => setNewInvestment({...newInvestment, amount: e.target.value})} />
                </InputGroup>
                <InputGroup label="Rentabilidade Estimada (% a.a.)">
                    <StyledInput type="number" placeholder="Ex: 12" value={newInvestment.returnRate} onChange={(e) => setNewInvestment({...newInvestment, returnRate: e.target.value})} />
                </InputGroup>
                <PrimaryButton onClick={handleAddInvestment} className="mt-2">Adicionar</PrimaryButton>
            </Modal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card icon={<InvestmentsIcon />} title="Carteira de Investimentos" subtitle="Diversificação é a única proteção grátis">
                        <div className="mb-6">
                             <h3 className="text-3xl font-bold text-white mb-1">{formatCurrency(totalInvested)}</h3>
                             <p className="text-slate-400 text-sm">Patrimônio Investido Total</p>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mb-6 relative min-h-[300px]">
                             <AllocationPieChart investments={investments} />
                        </div>

                        <PrimaryButton onClick={() => setModalOpen(true)}>+ Novo Aporte / Ativo</PrimaryButton>

                        <div className="mt-6 space-y-2 max-h-60 overflow-y-auto scrollbar-thin pr-1">
                            {investments.length === 0 && <p className="text-center text-slate-500 py-4">Sua carteira está vazia.</p>}
                            {investments.map(inv => (
                                <ItemCard key={inv.id}>
                                    <div className="flex justify-between items-center text-slate-300">
                                        <div>
                                            <p className="font-semibold text-white capitalize">{inv.type === 'rendaFixa' ? 'Renda Fixa' : inv.type}</p>
                                            <p className="text-sm">{formatCurrency(inv.amount)} {inv.returnRate > 0 && `| ${inv.returnRate}% a.a.`}</p>
                                        </div>
                                        <DangerButton onClick={() => handleRemoveInvestment(inv.id)}>Remover</DangerButton>
                                    </div>
                                </ItemCard>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                     <Card icon={<DiamondIcon />} title="Simulador de Riqueza" subtitle="O poder dos juros compostos no tempo">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <InputGroup label="Aporte Mensal">
                                <StyledInput 
                                    type="number" 
                                    value={simMonthly} 
                                    onChange={(e) => setSimMonthly(parseFloat(e.target.value) || 0)} 
                                />
                            </InputGroup>
                            <InputGroup label="Taxa (% a.a.)">
                                <StyledInput 
                                    type="number" 
                                    value={simRate} 
                                    onChange={(e) => setSimRate(parseFloat(e.target.value) || 0)} 
                                />
                            </InputGroup>
                            <InputGroup label="Anos">
                                <StyledInput 
                                    type="number" 
                                    value={simYears} 
                                    onChange={(e) => setSimYears(parseFloat(e.target.value) || 0)} 
                                />
                            </InputGroup>
                        </div>
                        
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 h-80">
                             <WealthChart 
                                monthlyContribution={simMonthly} 
                                initialAmount={totalInvested} 
                                years={simYears} 
                                interestRate={simRate} 
                             />
                        </div>
                        
                        <Alert type="info" className="mt-4 text-xs">
                            * Projeção teórica baseada em taxa constante. Não considera inflação ou impostos.
                        </Alert>
                     </Card>
                </div>
            </div>
        </>
    );
};
