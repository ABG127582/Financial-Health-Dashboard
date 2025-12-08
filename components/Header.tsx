
import React, { useState, useRef } from 'react';
import { Cog6ToothIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, TrashIcon } from '../constants';
import { useFinancialData, useFinancialDispatch } from '../context';
import { Modal } from './Modal';
import { PrimaryButton, DangerButton } from './common';

export const Header: React.FC = () => {
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const financialData = useFinancialData();
    const dispatch = useFinancialDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(financialData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `finance-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);
                if (confirm('Isso substituirá todos os seus dados atuais. Deseja continuar?')) {
                    dispatch({ type: 'IMPORT_DATA', payload: parsedData });
                    setSettingsOpen(false);
                    alert('Dados importados com sucesso!');
                }
            } catch (error) {
                alert('Erro ao ler arquivo. Certifique-se que é um JSON válido.');
                console.error(error);
            }
        };
        reader.readAsText(file);
        // Reset input
        event.target.value = '';
    };

    const handleReset = () => {
        if (confirm('Tem certeza que deseja APAGAR TODOS os dados? Esta ação não pode ser desfeita.')) {
            dispatch({ type: 'RESET_DATA' });
            setSettingsOpen(false);
        }
    };

    return (
        <header className="relative text-center mb-10 p-8 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700 shadow-2xl">
            <button 
                onClick={() => setSettingsOpen(true)}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
                title="Gerenciar Dados"
            >
                <Cog6ToothIcon className="w-6 h-6" />
            </button>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
                💰 Saúde Financeira
            </h1>
            <p className="text-slate-400 text-lg">
                Sistema completo de planejamento baseado nas regras 3G e 50-15-35
            </p>

            <Modal isOpen={isSettingsOpen} onClose={() => setSettingsOpen(false)} title="Gerenciamento de Dados">
                <div className="space-y-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <ArrowDownTrayIcon className="w-5 h-5" /> Backup (Exportar)
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">Baixe um arquivo com todos os seus dados para guardar com segurança.</p>
                        <PrimaryButton onClick={handleExport}>Baixar Dados (.json)</PrimaryButton>
                    </div>

                    <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                            <ArrowUpTrayIcon className="w-5 h-5" /> Restaurar (Importar)
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">Carregue um arquivo de backup anterior.</p>
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".json"
                            className="hidden"
                        />
                        <button 
                            onClick={handleImportClick}
                            className="w-full bg-slate-600 hover:bg-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                        >
                            Selecionar Arquivo
                        </button>
                    </div>

                    <div className="bg-red-900/20 p-4 rounded-lg border border-red-900/50">
                        <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                            <TrashIcon className="w-5 h-5" /> Zona de Perigo
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">Apaga todos os dados do navegador. Irreversível.</p>
                        <DangerButton onClick={handleReset} className="w-full py-3">Apagar Tudo</DangerButton>
                    </div>
                </div>
            </Modal>
        </header>
    );
};
