
import React, { useState, useMemo } from 'react';
import { OverviewTab } from './components/tabs/OverviewTab';
import { AllocationTab } from './components/tabs/AllocationTab';
import { EmergencyTab } from './components/tabs/EmergencyTab';
import { InvestmentsTab } from './components/tabs/InvestmentsTab';
import { AssetsTab } from './components/tabs/AssetsTab';
import { DebtsTab } from './components/tabs/DebtsTab';
import { GoalsTab } from './components/tabs/GoalsTab';
import { Header } from './components/Header';
import { FinancialSummary } from './components/FinancialSummary';
import { AIAdvisor } from './components/AIAdvisor';
import { FinancialDataProvider } from './context';
import type { Tab } from './types';
import { TABS } from './constants';

const AppContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const tabContent = useMemo(() => {
        switch (activeTab) {
            case 'overview': return <OverviewTab />;
            case 'allocation': return <AllocationTab />;
            case 'emergency': return <EmergencyTab />;
            case 'investments': return <InvestmentsTab />;
            case 'assets': return <AssetsTab />;
            case 'debts': return <DebtsTab />;
            case 'goals': return <GoalsTab />;
            default: return null;
        }
    }, [activeTab]);

    return (
        <div className="container mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <Header />

            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-3 mb-8">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-full font-semibold text-sm md:text-base transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-400 flex items-center gap-2 ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg transform -translate-y-1'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white hover:-translate-y-0.5'
                        }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <main>
                <div className="transition-opacity duration-500 ease-in-out">
                    {tabContent}
                </div>
            </main>

            <FinancialSummary />
            
            {/* AI Financial Advisor Component */}
            <AIAdvisor />
        </div>
    );
}

const App: React.FC = () => {
    return (
        <FinancialDataProvider>
            <AppContent />
        </FinancialDataProvider>
    );
};

export default App;
