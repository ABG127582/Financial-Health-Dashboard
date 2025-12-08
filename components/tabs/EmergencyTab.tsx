
import React, { useMemo } from 'react';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput, StyledSelect } from '../common';
import { ProgressBar } from '../ProgressBar';
import { Alert } from '../Alert';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { EmergencyIcon } from '../../constants';

export const EmergencyTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();

    const { employmentType, grossSalary, emergency } = financialData;

    const { target, progress, monthsComplete, missing, status } = useMemo(() => {
        if (!employmentType || grossSalary === 0) {
            return { target: 0, progress: 0, monthsComplete: '0.0', missing: 0, status: null };
        }
        
        const multiplier = employmentType === 'clt' ? 6 : employmentType === 'civil' ? 3 : 12;
        const targetValue = grossSalary * multiplier;
        const currentProgress = targetValue > 0 ? (emergency.current / targetValue) * 100 : 0;
        const months = grossSalary > 0 ? (emergency.current / grossSalary) : 0;
        const missingValue = Math.max(0, targetValue - emergency.current);

        let statusComponent = null;
        if (currentProgress >= 100) {
            statusComponent = <Alert type="success">🎉 Parabéns! Sua reserva de emergência está completa!</Alert>;
        } else if (currentProgress >= 50) {
            statusComponent = <Alert type="warning">👍 Você está no caminho certo! Continue guardando.</Alert>;
        } else {
            statusComponent = <Alert type="danger">⚠️ Priorize completar sua reserva de emergência!</Alert>;
        }

        return {
            target: targetValue,
            progress: currentProgress,
            monthsComplete: months.toFixed(1),
            missing: missingValue,
            status: statusComponent
        };
    }, [employmentType, grossSalary, emergency.current]);

    return (
        <Card icon={<EmergencyIcon />} title="Conta Salva Guarda" subtitle="Guardar em aplicações com liquidez (Selic)">
            <InputGroup label="👔 Tipo de Vínculo Empregatício">
                <StyledSelect 
                    value={employmentType} 
                    onChange={e => dispatch({ type: 'UPDATE_FIELD', payload: { key: 'employmentType', value: e.target.value }})}
                >
                    <option value="">Selecione...</option>
                    <option value="clt">CLT - Precisa de 6x o salário bruto</option>
                    <option value="civil">Concursado - Precisa de 3x o salário bruto</option>
                    <option value="other">Autônomo - Precisa de 12x as despesas</option>
                </StyledSelect>
            </InputGroup>
            <InputGroup label="💰 Salário/Renda Bruta Mensal (R$)">
                <StyledInput 
                    type="number" 
                    placeholder="Ex: 5000" 
                    value={grossSalary || ''}
                    onChange={e => dispatch({ type: 'UPDATE_FIELD', payload: { key: 'grossSalary', value: parseFloat(e.target.value) || 0 }})}
                />
            </InputGroup>
            <InputGroup label="🏦 Valor Já Guardado na Reserva (R$)">
                <StyledInput 
                    type="number" 
                    placeholder="Ex: 10000" 
                    value={emergency.current || ''}
                    onChange={e => dispatch({ type: 'UPDATE_FIELD', payload: { key: 'emergency', value: { current: parseFloat(e.target.value) || 0 } }})}
                />
            </InputGroup>

            {employmentType && grossSalary > 0 && (
                <div className="bg-slate-700/50 p-6 rounded-lg mt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Meta: R$ {target.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </h3>
                    <ProgressBar progress={progress} />
                    <div className="mt-4 text-slate-300 space-y-1">
                        <p><strong>Já guardado:</strong> R$ {emergency.current.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({progress.toFixed(1)}%)</p>
                        <p><strong>Equivale a:</strong> {monthsComplete} meses de proteção</p>
                        {missing > 0 && <p><strong>Falta guardar:</strong> R$ {missing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>}
                    </div>
                    <div className="mt-4">{status}</div>
                </div>
            )}
        </Card>
    );
};
