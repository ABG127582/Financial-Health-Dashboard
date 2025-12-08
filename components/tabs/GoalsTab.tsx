
import React, { useState } from 'react';
import type { Goal } from '../../types';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput, PrimaryButton, DangerButton, ItemCard } from '../common';
import { ProgressBar } from '../ProgressBar';
import { Modal } from '../Modal';
import { formatCurrency } from '../../utils/formatting';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { GoalsIcon } from '../../constants';

export const GoalsTab: React.FC = () => {
    const { goals } = useFinancialData();
    const dispatch = useFinancialDispatch();
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', amount: '', deadline: '', saved: '' });

    const handleAddGoal = () => {
        if (!newGoal.title || !newGoal.amount || !newGoal.deadline) return;
        const goal: Goal = {
            id: Date.now(),
            title: newGoal.title,
            amount: parseFloat(newGoal.amount),
            deadline: newGoal.deadline,
            saved: parseFloat(newGoal.saved) || 0,
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'goals', item: goal } });
        setNewGoal({ title: '', amount: '', deadline: '', saved: '' });
        setModalOpen(false);
    };

    const handleRemoveGoal = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'goals', id } });
    };

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Objetivo Financeiro">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="🎯 Objetivo">
                        <StyledInput type="text" placeholder="Ex: Comprar carro" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})}/>
                    </InputGroup>
                    <InputGroup label="💰 Valor Meta (R$)">
                        <StyledInput type="number" placeholder="Ex: 30000" value={newGoal.amount} onChange={e => setNewGoal({...newGoal, amount: e.target.value})}/>
                    </InputGroup>
                    <InputGroup label="📅 Prazo">
                        <StyledInput type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}/>
                    </InputGroup>
                    <InputGroup label="🏦 Valor Já Economizado (R$)">
                        <StyledInput type="number" placeholder="Ex: 5000" value={newGoal.saved} onChange={e => setNewGoal({...newGoal, saved: e.target.value})}/>
                    </InputGroup>
                </div>
                <PrimaryButton onClick={handleAddGoal} className="mt-2">Adicionar Objetivo</PrimaryButton>
            </Modal>
            
            <Card icon={<GoalsIcon />} title="Objetivos Financeiros" subtitle="Defina metas claras e acompanhe o progresso">
                <PrimaryButton onClick={() => setModalOpen(true)}>+ Adicionar Objetivo</PrimaryButton>
                
                <div className="mt-6">
                     <h3 className="text-lg font-semibold text-white mb-4">Objetivos Ativos</h3>
                    {goals.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>Você ainda não tem objetivos definidos.</p>
                            <p className="text-sm">Clique em "Adicionar Objetivo" para começar a planejar seu futuro!</p>
                        </div>
                    ) : (
                        goals.map(goal => {
                            const progress = goal.amount > 0 ? (goal.saved / goal.amount) * 100 : 0;
                            const remaining = goal.amount - goal.saved;
                            const deadlineDate = new Date(goal.deadline);
                            const today = new Date();
                            const monthsRemaining = Math.max(1, Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
                            const monthlyNeeded = remaining > 0 ? remaining / monthsRemaining : 0;

                            return (
                                <ItemCard key={goal.id}>
                                    <div className="flex justify-between items-start text-slate-300 mb-2">
                                        <p className="font-semibold text-white">{goal.title}</p>
                                        <DangerButton onClick={() => handleRemoveGoal(goal.id)}>Remover</DangerButton>
                                    </div>
                                    <div className="space-y-1 text-sm mb-3">
                                        <p><strong>Meta:</strong> {formatCurrency(goal.amount)} | <strong>Guardado:</strong> {formatCurrency(goal.saved)}</p>
                                        <p><strong>Prazo:</strong> {deadlineDate.toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
                                        <p><strong>Necessário:</strong> {formatCurrency(monthlyNeeded)}/mês por {monthsRemaining} meses</p>
                                    </div>
                                    <ProgressBar progress={progress} color="from-purple-500 to-indigo-500" />
                                    <p className="text-right text-xs mt-1 font-bold text-slate-400">{progress.toFixed(1)}%</p>
                                </ItemCard>
                            );
                        })
                    )}
                </div>
            </Card>
        </>
    );
};
