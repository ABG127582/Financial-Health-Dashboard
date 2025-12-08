import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { useFinancialData } from '../context';
import { calculateFinancialMetrics } from '../utils/analytics';
import { formatCurrency } from '../utils/formatting';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon } from '../constants';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const AIAdvisor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const financialData = useFinancialData();
    const chatRef = useRef<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const metrics = useMemo(() => calculateFinancialMetrics(financialData), [financialData]);

    // Initialize or update chat when opened
    useEffect(() => {
        if (isOpen && !chatRef.current) {
            try {
                let apiKey = '';
                // Safe access to API key that works in both Node-like and Browser environments
                if (typeof process !== 'undefined' && process.env) {
                    apiKey = process.env.API_KEY || '';
                }

                if (!apiKey) {
                     setMessages([{ role: 'model', text: '⚠️ Erro de configuração: Chave de API não encontrada.' }]);
                     return;
                }

                const ai = new GoogleGenAI({ apiKey });
                
                const systemInstruction = `
                    Você é o 'Fin', um consultor financeiro pessoal, empático e extremamente analítico.
                    
                    CONTEXTO DO USUÁRIO (Resumo Já Calculado):
                    - Score de Saúde: ${metrics.score}/100
                    - Patrimônio Líquido: ${formatCurrency(metrics.netWorth)}
                    - Renda Mensal: ${formatCurrency(financialData.income)}
                    - Total de Dívidas: ${formatCurrency(metrics.totalDebt)} (Compromete ${metrics.debtRatio.toFixed(1)}% da renda)
                    - Reserva de Emergência: ${metrics.emergencyMonths.toFixed(1)} meses (Meta: ${formatCurrency(metrics.emergencyTarget)})
                    - Taxa de Poupança: ${metrics.savingsRate.toFixed(1)}% (Investindo ${formatCurrency(metrics.monthlyInvested)}/mês)
                    
                    DADOS BRUTOS:
                    ${JSON.stringify(financialData)}

                    REGRAS DE INTERAÇÃO:
                    1. Seja conciso e direto. Use listas e bullet points.
                    2. Se o usuário tiver dívidas altas (ratio > 30%), foque nisso primeiro.
                    3. Se a reserva for baixa (<3 meses), alerte sobre risco.
                    4. Use formatação Markdown (**negrito**) para destacar números.
                    5. Responda sempre em Português do Brasil.
                `;

                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemInstruction,
                        temperature: 0.7,
                    },
                });
                
                if (messages.length === 0) {
                    setMessages([{
                        role: 'model', 
                        text: `Olá! Sou o Fin. Vi que seu Score de Saúde está em **${metrics.score}/100**. Quer ajuda para melhorá-lo hoje?`
                    }]);
                }
            } catch (error) {
                console.error("Failed to init AI", error);
                setMessages(prev => [...prev, { role: 'model', text: 'Erro ao conectar com o assistente. Tente recarregar a página.' }]);
            }
        }
    }, [isOpen, financialData, metrics, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const resultStream = await chatRef.current.sendMessageStream({ message: userMsg });
            
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            let fullResponse = '';
            for await (const chunk of resultStream) {
                const c = chunk as GenerateContentResponse;
                const text = c.text;
                if (text) {
                    fullResponse += text;
                    setMessages(prev => {
                        const newHistory = [...prev];
                        newHistory[newHistory.length - 1] = { role: 'model', text: fullResponse };
                        return newHistory;
                    });
                }
            }
        } catch (error) {
            console.error("Error sending message", error);
            setMessages(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', text: 'Desculpe, tive um erro ao processar. Tente novamente.' };
                return newHistory;
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickPrompt = (prompt: string) => {
        setInput(prompt);
    };
    
    const handleReset = () => {
        chatRef.current = null;
        setMessages([]);
        setIsOpen(false);
        setTimeout(() => setIsOpen(true), 100);
    };

    const suggestedPrompts = useMemo(() => {
        const prompts = [];
        if (metrics.debtRatio > 20) prompts.push("Plano para quitar dívidas");
        if (metrics.savingsRate < 15) prompts.push("Como sobrar dinheiro?");
        if (metrics.emergencyMonths < 3) prompts.push("Montar reserva rápido");
        prompts.push("Analise meu perfil");
        prompts.push("Onde investir R$ 1000?");
        return prompts;
    }, [metrics]);

    const renderMessageText = (text: string) => {
        return text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
                    part.startsWith('**') && part.endsWith('**') 
                        ? <strong key={j} className="text-indigo-300">{part.slice(2, -2)}</strong> 
                        : part
                )}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-purple-500/50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Abrir Assistente Financeiro"
            >
                <SparklesIcon className="w-8 h-8" />
            </button>

            <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[95vw] md:w-[400px] h-[80vh] max-h-[600px] bg-slate-800/95 backdrop-blur-xl border border-slate-600 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
                
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Fin Advisor</h3>
                            <p className="text-xs text-indigo-300 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Gemini 2.5 Flash
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleReset} className="text-xs text-slate-400 hover:text-white underline mr-2" title="Reiniciar conversa com dados atuais">Atualizar</button>
                        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                                    : 'bg-slate-700 text-slate-200 rounded-bl-none shadow-sm border border-slate-600'
                            }`}>
                                {msg.role === 'model' ? renderMessageText(msg.text) : msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="px-4 pb-2 pt-2 bg-slate-800/50">
                     <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-2">
                        {suggestedPrompts.map((prompt, idx) => (
                            <button 
                                key={idx}
                                onClick={() => handleQuickPrompt(prompt)}
                                className="whitespace-nowrap text-xs px-3 py-1.5 bg-slate-700 hover:bg-indigo-600/40 border border-slate-600 hover:border-indigo-500 text-indigo-200 rounded-full transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 border-t border-slate-700 rounded-b-2xl">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder="Digite sua dúvida..."
                            disabled={isLoading}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};