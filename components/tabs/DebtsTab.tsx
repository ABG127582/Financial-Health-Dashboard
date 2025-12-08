
import React, { useState, useMemo } from 'react';
import type { Debt } from '../../types';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput, PrimaryButton, DangerButton, ItemCard } from '../common';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { formatCurrency } from '../../utils/formatting';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { DebtsIcon } from '../../constants';

export const DebtsTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();

    const { debts, income, extraIncomes } = financialData;
    const [isModalOpen, setModalOpen] = useState(false);
    const [newDebt, setNewDebt] = useState({ name: '', amount: '', interest: '', payment: '' });

    const handleAddDebt = () => {
        if (!newDebt.name || !newDebt.amount || !newDebt.payment) return;
        const debt: Debt = {
            id: Date.now(),
            name: newDebt.name,
            amount: parseFloat(newDebt.amount),
            interest: parseFloat(newDebt.interest) || 0,
            payment: parseFloat(newDebt.payment),
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'debts', item: debt } });
        setNewDebt({ name: '', amount: '', interest: '', payment: '' });
        setModalOpen(false);
    };

    const handleRemoveDebt = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'debts', id } });
    };

    const debtSummary = useMemo(() => {
        if (debts.length === 0) return null;
        
        const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
        const totalPayment = debts.reduce((sum, d) => sum + d.payment, 0);
        const debtToIncome = income > 0 ? (totalPayment / income * 100) : 0;
        
        let statusType: 'success' | 'warning' | 'danger' = 'success';
        let statusMessage = '✅ Endividamento sob controle';
        if (debtToIncome > 30) {
            statusType = 'danger';
            statusMessage = '⚠️ Endividamento crítico! Use rendas extras para acelerar.';
        } else if (debtToIncome > 20) {
            statusType = 'warning';
            statusMessage = '⚠️ Fique atento ao endividamento';
        }

        const extraForDebt = extraIncomes.filter(e => e.use === 'debt').reduce((s, e) => s + e.amount, 0);

        return { totalDebt, totalPayment, debtToIncome, statusType, statusMessage, extraForDebt };
    }, [debts, income, extraIncomes]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Dívida">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="📝 Descrição da Dívida">
                        <StyledInput type="text" placeholder="Ex: Cartão de Crédito" value={newDebt.name} onChange={e => setNewDebt({...newDebt, name: e.target.value})}/>
                    </InputGroup>
                    <InputGroup label="💰 Valor Total (R$)">
                        <StyledInput type="number" placeholder="Ex: 5000" value={newDebt.amount} onChange={e => setNewDebt({...newDebt, amount: e.target.value})}/>
                    </InputGroup>
                    <InputGroup label="📊 Taxa de Juros (% ao mês)">
                        <StyledInput type="number" placeholder="Ex: 3.5" step="0.1" value={newDebt.interest} onChange={e => setNewDebt({...newDebt, interest: e.target.value})}/>
                    </InputGroup>
                     <InputGroup label="💳 Parcela Mensal (R$)">
                        <StyledInput type="number" placeholder="Ex: 500" value={newDebt.payment} onChange={e => setNewDebt({...newDebt, payment: e.target.value})}/>
                    </InputGroup>
                </div>
                <PrimaryButton onClick={handleAddDebt} className="mt-2">Adicionar Dívida</PrimaryButton>
            </Modal>

            <Card icon={<DebtsIcon />} title="Controle de Dívidas" subtitle="Use o acelerador (bicos) para pagar mais rápido!">
                <PrimaryButton onClick={() => setModalOpen(true)}>+ Adicionar Dívida</PrimaryButton>
                
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Suas Dívidas</h3>
                    {debts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>Nenhuma dívida para mostrar.</p>
                        </div>
                    ) : (
                        debts.map(debt => (
                            <ItemCard key={debt.id}>
                                <div className="flex justify-between items-start text-slate-300">
                                   <div>
                                        <p className="font-semibold text-white">{debt.name}</p>
                                        <p className="text-sm">Saldo: {formatCurrency(debt.amount)} | Parcela: {formatCurrency(debt.payment)}</p>
                                        {debt.interest > 2 && <div className="text-xs font-bold text-red-400 mt-1">⚠️ Juros altos! Priorize esta dívida</div>}
                                    </div>
                                    <DangerButton onClick={() => handleRemoveDebt(debt.id)}>Remover</DangerButton>
                                </div>
                            </ItemCard>
                        ))
                    )}
                </div>
                
                {debtSummary ? (
                    <>
                        <Alert type={debtSummary.statusType} className="mt-6">
                            <strong>📊 Resumo de Dívidas:</strong><br/>
                            💰 Total devido: {formatCurrency(debtSummary.totalDebt)}<br/>
                            💵 Parcelas mensais: {formatCurrency(debtSummary.totalPayment)}<br/>
                            📈 Comprometimento da renda: {debtSummary.debtToIncome.toFixed(1)}%<br/>
                            {debtSummary.statusMessage}
                        </Alert>
                        {debtSummary.extraForDebt > 0 && (
                            <Alert type="success" className="mt-4">
                                <strong>🚀 Com renda extra de {formatCurrency(debtSummary.extraForDebt)}, você acelera a quitação!</strong>
                            </Alert>
                        )}
                    </>
                ) : (
                    <Alert type="success" className="mt-6">🎉 Parabéns! Você não tem dívidas registradas!</Alert>
                )}
            </Card>
        </>
    );
};
