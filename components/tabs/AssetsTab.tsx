
import React, { useState, useMemo } from 'react';
import type { Asset } from '../../types';
import { Card } from '../Card';
import { InputGroup } from '../InputGroup';
import { StyledInput, StyledSelect, PrimaryButton, DangerButton, ItemCard } from '../common';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { formatCurrency } from '../../utils/formatting';
import { useFinancialData, useFinancialDispatch } from '../../context';
import { AssetsIcon } from '../../constants';

export const AssetsTab: React.FC = () => {
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();

    const { assets, income } = financialData;
    const [isModalOpen, setModalOpen] = useState(false);
    const [newAsset, setNewAsset] = useState({ name: '', category: 'eletronico', age: '', cost: '' });

    const handleAddAsset = () => {
        if (!newAsset.name || !newAsset.category || !newAsset.age || !newAsset.cost) return;
        const asset: Asset = {
            id: Date.now(),
            name: newAsset.name,
            category: newAsset.category,
            age: parseInt(newAsset.age, 10),
            cost: parseFloat(newAsset.cost),
        };
        dispatch({ type: 'ADD_ITEM', payload: { list: 'assets', item: asset } });
        setNewAsset({ name: '', category: 'eletronico', age: '', cost: '' });
        setModalOpen(false);
    };

    const handleRemoveAsset = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { list: 'assets', id } });
    };
    
    const replacementInfo = useMemo(() => {
        const toReplace = assets.filter(a => a.age >= 7);
        if (toReplace.length === 0) return null;
        
        const totalCost = toReplace.reduce((sum, a) => sum + a.cost, 0);
        const monthlyReserve = (financialData.allocation.currentEssential || (income * 0.50)) * 0.05;

        const monthsNeeded = monthlyReserve > 0 ? Math.ceil(totalCost / monthlyReserve) : Infinity;

        return {
            count: toReplace.length,
            totalCost,
            monthlyReserve,
            monthsNeeded: isFinite(monthsNeeded) ? monthsNeeded : 'N/A'
        };
    }, [assets, income, financialData.allocation.currentEssential]);

    return (
        <>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Item ao Patrimônio">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputGroup label="🔧 Item/Equipamento">
                        <StyledInput type="text" placeholder="Ex: Geladeira" value={newAsset.name} onChange={e => setNewAsset({...newAsset, name: e.target.value})} />
                    </InputGroup>
                    <InputGroup label="📦 Categoria">
                        <StyledSelect value={newAsset.category} onChange={e => setNewAsset({...newAsset, category: e.target.value})}>
                            <option value="eletronico">💻 Eletrônico</option>
                            <option value="eletrico">⚡ Elétrico</option>
                            <option value="movel">🪑 Móvel</option>
                            <option value="outro">📦 Outro</option>
                        </StyledSelect>
                    </InputGroup>
                    <InputGroup label="📅 Idade do Item (anos)">
                        <StyledInput type="number" placeholder="Ex: 5" min="0" value={newAsset.age} onChange={e => setNewAsset({...newAsset, age: e.target.value})} />
                    </InputGroup>
                    <InputGroup label="💵 Valor Estimado de Troca (R$)">
                        <StyledInput type="number" placeholder="Ex: 2000" value={newAsset.cost} onChange={e => setNewAsset({...newAsset, cost: e.target.value})} />
                    </InputGroup>
                </div>
                <PrimaryButton onClick={handleAddAsset} className="mt-2">Adicionar ao Patrimônio</PrimaryButton>
            </Modal>

            <Card icon={<AssetsIcon />} title="Planejamento de Trocas" subtitle="Reserve 5% dos essenciais para trocas com 7+ anos">
                <Alert type="info"><strong>📝 Regra:</strong> Planeje trocar eletrônicos, elétricos e móveis com mais de 7 anos de uso.</Alert>

                <div className="mt-6">
                    <PrimaryButton onClick={() => setModalOpen(true)}>+ Adicionar ao Patrimônio</PrimaryButton>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Seu Patrimônio</h3>
                    {assets.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>Nenhum item de patrimônio adicionado.</p>
                             <p className="text-sm">Adicione itens para planejar suas futuras trocas.</p>
                        </div>
                    ) : (
                        assets.map(asset => (
                            <ItemCard key={asset.id}>
                                <div className="flex justify-between items-start text-slate-300">
                                    <div>
                                        <p className="font-semibold text-white">{asset.name}</p>
                                        <p className="text-sm">Idade: {asset.age} anos | Custo de troca: {formatCurrency(asset.cost)}</p>
                                        {asset.age >= 7 ? 
                                            <div className="text-xs font-bold text-red-400 mt-1">⚠️ Planeje a troca</div> :
                                            <div className="text-xs font-bold text-green-400 mt-1">✅ Em bom estado</div>
                                        }
                                    </div>
                                    <DangerButton onClick={() => handleRemoveAsset(asset.id)}>Remover</DangerButton>
                                </div>
                            </ItemCard>
                        ))
                    )}
                </div>

                {replacementInfo && (
                    <Alert type="warning" className="mt-6">
                        <strong>📊 Planejamento de Trocas:</strong><br />
                        🔧 {replacementInfo.count} item(ns) precisam ser trocados<br />
                        💰 Valor total estimado: {formatCurrency(replacementInfo.totalCost)}<br />
                        💵 Reserva mensal (5% essenciais): {formatCurrency(replacementInfo.monthlyReserve)}<br />
                        📅 Tempo para completar: {replacementInfo.monthsNeeded} meses
                    </Alert>
                )}
            </Card>
        </>
    );
};
