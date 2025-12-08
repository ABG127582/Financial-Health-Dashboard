
import React, { useState, useMemo, useEffect } from 'react';
import type { PlannedEvent, ExtraIncome, Expense } from '../../types';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { Alert } from '../Alert';
import { StyledInput, StyledSelect, PrimaryButton, DangerButton, ItemCard } from '../common';
import { Modal } from '../Modal';
import { formatCurrency } from '../../utils/formatting';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { AllocationIcon, RocketIcon, PartyIcon, TrashIcon } from '../../constants';

export const AllocationTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();

    const { income, allocation, expenses } = financialData;
    
    const [isEventModalOpen, setEventModalOpen] = useState(false);
    const [isExtraIncomeModalOpen, setExtraIncomeModalOpen] = useState(false);
    const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);

    const [event, setEvent] = useState({ name: '', cost: '', date: '' });
    const [extraIncome, setExtraIncome] = useState({ name: '', amount: '', use: 'debt' });
    const [newExpense, setNewExpense] = useState<{ name: string, amount: string, category: 'essential' | 'lifestyle' }>({ name: '', amount: '', category: 'essential' });

    // Automatically calculate totals from expenses list
    useEffect(() => {
        const totalEssential = expenses.filter(e => e.category === 'essential').reduce((sum, e) => sum + e.amount, 0);
        const totalLifestyle = expenses.filter(e => e.category === 'lifestyle').reduce((sum, e) => sum + e.amount, 0);

        // Only update if different to avoid infinite loops
        if (totalEssential !== allocation.currentEssential || totalLifestyle !== allocation.currentEnjoy) {
             dispatch({
                type: 'UPDATE_FIELD',
                payload: {
                    key: 'allocation',
                    value: { 
                        ...allocation, 
                        currentEssential: totalEssential,
                        currentEnjoy: totalLifestyle
                    }
                }
            });
        }
    }, [expenses, dispatch, allocation.currentEssential, allocation.currentEnjoy, allocation.currentInvestment]);

    const handleAllocationChange = (field: keyof typeof allocation, value: number) => {
        dispatch({
            type: 'UPDATE_FIELD',
            payload: {
                key: 'allocation',
                value: { ...allocation, [field]: value }
            }
        });
    };

    const idealValues = useMemo(() => {
        if (income === 0) return { essential: 0, invest: 0, enjoy: 0 };
        return {
            essential: income * 0.50,
            invest: income * 0.15,
            enjoy: income * 0.35,
        };
    }, [income]);

    const allocationFeedback = useMemo(() => {
        if (income === 0) return null;
        const feedbacks = [];
        if (allocation.currentEssential > idealValues.essential) {
            const diff = ((allocation.currentEssential / idealValues.essential - 1) * 100).toFixed(0);
            feedbacks.push(<Alert key="essential" type="danger">⚠️ Essenciais {diff}% acima do ideal. Tente reduzir custos fixos.</Alert>);
        } else {
            feedbacks.push(<Alert key="essential" type="success">✅ Essenciais dentro da meta (50%).</Alert>);
        }
        if (allocation.currentInvestment < idealValues.invest) {
            const missing = idealValues.invest - allocation.currentInvestment;
            feedbacks.push(<Alert key="invest" type="warning">💡 Invista mais R$ {missing.toFixed(0)} para atingir 15%.</Alert>);
        } else {
            feedbacks.push(<Alert key="invest" type="success">✅ Meta de investimento (15%) atingida!</Alert>);
        }
        if (allocation.currentEnjoy > idealValues.enjoy) {
             feedbacks.push(<Alert key="enjoy" type="warning">⚠️ Lazer acima do ideal (35%). Cuidado com excessos.</Alert>);
        }
        return feedbacks;
    }, [income, allocation, idealValues]);
    
    const handleAddExpense = () => {
        if (!newExpense.name || !newExpense.amount) return;
        const expense: Expense = {
            id: Date.now(),
            name: newExpense.name,
            amount: parseFloat(newExpense.amount),
            category: newExpense.category,
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'expenses', item: expense } });
        setNewExpense({ name: '', amount: '', category: newExpense.category }); // Keep category selected
        setExpenseModalOpen(false);
    };

    const handleRemoveExpense = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'expenses', id } });
    };

    // Event Handlers
    const handleAddEvent = () => {
        if (!event.name || !event.cost || !event.date) return;
        const newEvent: PlannedEvent = {
            id: Date.now(),
            name: event.name,
            cost: parseFloat(event.cost),
            date: event.date,
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'events', item: newEvent } });
        setEvent({ name: '', cost: '', date: '' });
        setEventModalOpen(false);
    };

    const handleRemoveEvent = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'events', id } });
    };

    const handleAddExtraIncome = () => {
        if (!extraIncome.name || !extraIncome.amount) return;
        const newExtra: ExtraIncome = {
            id: Date.now(),
            name: extraIncome.name,
            amount: parseFloat(extraIncome.amount),
            use: extraIncome.use,
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'extraIncomes', item: newExtra } });
        setExtraIncome({ name: '', amount: '', use: 'debt' });
        setExtraIncomeModalOpen(false);
    };

    const handleRemoveExtraIncome = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'extraIncomes', id } });
    };

    return (
        <>
             {/* Expense Modal */}
             <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} title="Adicionar Despesa">
                <InputGroup label="📝 Nome da Despesa">
                    <StyledInput type="text" placeholder="Ex: Aluguel, Netflix" value={newExpense.name} onChange={(e) => setNewExpense({...newExpense, name: e.target.value})} />
                </InputGroup>
                <InputGroup label="💰 Valor Mensal (R$)">
                    <StyledInput type="number" placeholder="Ex: 1200" value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
                </InputGroup>
                <InputGroup label="📂 Categoria">
                    <StyledSelect value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value as any})}>
                        <option value="essential">🏠 Essencial (50%) - Moradia, Contas, Mercado</option>
                        <option value="lifestyle">🎉 Estilo de Vida (35%) - Lazer, Restaurantes, Assinaturas</option>
                    </StyledSelect>
                </InputGroup>
                <PrimaryButton onClick={handleAddExpense} className="mt-2">Salvar Despesa</PrimaryButton>
            </Modal>

            <Modal isOpen={isEventModalOpen} onClose={() => setEventModalOpen(false)} title="Adicionar Evento ou Viagem">
                 <InputGroup label="🎯 Evento/Viagem">
                    <StyledInput type="text" placeholder="Ex: Férias na Praia" value={event.name} onChange={(e) => setEvent({...event, name: e.target.value})} />
                </InputGroup>
                <InputGroup label="💰 Valor Necessário (R$)">
                    <StyledInput type="number" placeholder="Ex: 3000" value={event.cost} onChange={(e) => setEvent({...event, cost: e.target.value})} />
                </InputGroup>
                <InputGroup label="📅 Data Planejada">
                    <StyledInput type="date" value={event.date} onChange={(e) => setEvent({...event, date: e.target.value})} />
                </InputGroup>
                <PrimaryButton onClick={handleAddEvent} className="mt-2">Adicionar ao Planejamento</PrimaryButton>
            </Modal>
            
            <Modal isOpen={isExtraIncomeModalOpen} onClose={() => setExtraIncomeModalOpen(false)} title="Adicionar Renda Extra">
                <InputGroup label="💼 Descrição do Bico/Renda Extra">
                    <StyledInput type="text" placeholder="Ex: Freelance, Vendas" value={extraIncome.name} onChange={(e) => setExtraIncome({...extraIncome, name: e.target.value})} />
                </InputGroup>
                <InputGroup label="💵 Valor Mensal Estimado (R$)">
                    <StyledInput type="number" placeholder="Ex: 500" value={extraIncome.amount} onChange={(e) => setExtraIncome({...extraIncome, amount: e.target.value})} />
                </InputGroup>
                <InputGroup label="🎯 Usar para">
                    <StyledSelect value={extraIncome.use} onChange={(e) => setExtraIncome({...extraIncome, use: e.target.value})}>
                        <option value="debt">💳 Pagar Dívidas Mais Rápido</option>
                        <option value="goal">🛒 Compra à Vista</option>
                        <option value="emergency">🛡️ Fundo de Emergência</option>
                        <option value="invest">📈 Investimentos Extra</option>
                    </StyledSelect>
                </InputGroup>
                <PrimaryButton onClick={handleAddExtraIncome} className="mt-2">Adicionar Renda Extra</PrimaryButton>
            </Modal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <Card icon={<AllocationIcon />} title="Regra 50-15-35" subtitle="Distribuição ideal da sua renda líquida">
                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
                            <div className="p-2 md:p-4 rounded-lg text-center bg-orange-500/20 border border-orange-500/30">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">50%</h3>
                                <p className="text-xs md:text-sm text-orange-300">Essenciais</p>
                                <div className="text-sm font-medium text-white mt-1">{formatCurrency(idealValues.essential)}</div>
                            </div>
                            <div className="p-2 md:p-4 rounded-lg text-center bg-teal-500/20 border border-teal-500/30">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">15%</h3>
                                <p className="text-xs md:text-sm text-teal-300">Investir</p>
                                <div className="text-sm font-medium text-white mt-1">{formatCurrency(idealValues.invest)}</div>
                            </div>
                            <div className="p-2 md:p-4 rounded-lg text-center bg-purple-500/20 border border-purple-500/30">
                                <h3 className="text-2xl md:text-3xl font-bold text-white">35%</h3>
                                <p className="text-xs md:text-sm text-purple-300">Lazer</p>
                                <div className="text-sm font-medium text-white mt-1">{formatCurrency(idealValues.enjoy)}</div>
                            </div>
                        </div>

                        {allocationFeedback}

                        <div className="mt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-white">Detalhamento de Gastos</h3>
                                <button onClick={() => setExpenseModalOpen(true)} className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-colors">
                                    + Nova Despesa
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Essentials Column */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-orange-400 font-bold text-sm uppercase mb-3 flex justify-between">
                                        🏠 Essenciais 
                                        <span>{formatCurrency(allocation.currentEssential)}</span>
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                                        {expenses.filter(e => e.category === 'essential').map(e => (
                                            <div key={e.id} className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700 text-sm">
                                                <span className="text-slate-300 truncate max-w-[60%]">{e.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium">{formatCurrency(e.amount)}</span>
                                                    <button onClick={() => handleRemoveExpense(e.id)} className="text-slate-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </div>
                                        ))}
                                        {expenses.filter(e => e.category === 'essential').length === 0 && <p className="text-slate-500 text-xs italic">Nenhum gasto registrado</p>}
                                    </div>
                                </div>

                                {/* Lifestyle Column */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-purple-400 font-bold text-sm uppercase mb-3 flex justify-between">
                                        🎉 Estilo de Vida
                                        <span>{formatCurrency(allocation.currentEnjoy)}</span>
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                                        {expenses.filter(e => e.category === 'lifestyle').map(e => (
                                            <div key={e.id} className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700 text-sm">
                                                <span className="text-slate-300 truncate max-w-[60%]">{e.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium">{formatCurrency(e.amount)}</span>
                                                    <button onClick={() => handleRemoveExpense(e.id)} className="text-slate-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                                                </div>
                                            </div>
                                        ))}
                                        {expenses.filter(e => e.category === 'lifestyle').length === 0 && <p className="text-slate-500 text-xs italic">Nenhum gasto registrado</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <InputGroup label="📈 Total Investido Mensalmente (R$)">
                                <StyledInput 
                                    type="number" 
                                    value={allocation.currentInvestment || ''} 
                                    onChange={(e) => handleAllocationChange('currentInvestment', parseFloat(e.target.value) || 0)} 
                                    className="border-teal-500/50 focus:border-teal-500 focus:ring-teal-500"
                                />
                                <p className="text-xs text-slate-400 mt-1">Valor que sai da sua conta para corretora todo mês.</p>
                            </InputGroup>
                        </div>
                    </Card>
                </div>
                
                <div className="space-y-6">
                    <Card icon={<RocketIcon />} title="Renda Extra" subtitle="Acelerador de objetivos">
                        <PrimaryButton onClick={() => setExtraIncomeModalOpen(true)}>+ Adicionar Renda Extra</PrimaryButton>
                        <div className="mt-4 space-y-2">
                            {financialData.extraIncomes.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 bg-slate-900/30 rounded-lg border border-dashed border-slate-700">
                                    <p>Sem renda extra registrada.</p>
                                </div>
                            ) : (
                                financialData.extraIncomes.map(ei => (
                                    <ItemCard key={ei.id}>
                                        <div className="flex justify-between items-center text-slate-300">
                                            <div>
                                                <p className="font-semibold text-white">💼 {ei.name} - {formatCurrency(ei.amount)}</p>
                                                <p className="text-sm text-teal-400">🎯 Destino: {ei.use === 'debt' ? 'Dívidas' : ei.use === 'goal' ? 'Compras' : 'Investimentos'}</p>
                                            </div>
                                            <DangerButton onClick={() => handleRemoveExtraIncome(ei.id)}>Remover</DangerButton>
                                        </div>
                                    </ItemCard>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card icon={<PartyIcon />} title="Planejamento de Lazer" subtitle="Reserve para grandes momentos">
                        <h3 className="text-lg font-semibold text-white mb-4">Próximas Viagens e Eventos</h3>
                        <PrimaryButton onClick={() => setEventModalOpen(true)}>+ Adicionar Evento</PrimaryButton>
                        <div className="mt-4 space-y-2">
                             {financialData.events.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 bg-slate-900/30 rounded-lg border border-dashed border-slate-700">
                                    <p>Nenhum evento planejado.</p>
                                </div>
                             ) : (
                                financialData.events.map(ev => (
                                    <ItemCard key={ev.id}>
                                        <div className="flex justify-between items-start text-slate-300">
                                            <div>
                                                <p className="font-semibold text-white">✈️ {ev.name}</p>
                                                <p className="text-sm">Custo: {formatCurrency(ev.cost)}</p>
                                                <p className="text-sm text-slate-400">Data: {new Date(ev.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                            </div>
                                            <DangerButton onClick={() => handleRemoveEvent(ev.id)}>Remover</DangerButton>
                                        </div>
                                    </ItemCard>
                                ))
                             )}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};
