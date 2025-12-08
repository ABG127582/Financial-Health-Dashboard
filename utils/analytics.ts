
import type { FinancialData } from '../types';

export interface FinancialMetrics {
    totalDebt: number;
    totalDebtPayments: number;
    totalInvested: number;
    totalAssetsValue: number;
    totalGoalsSaved: number;
    totalAssets: number;
    totalLiabilities: number;
    netWorth: number;
    debtRatio: number;
    savingsRate: number;
    emergencyTarget: number;
    emergencyMonths: number;
    score: number;
    monthlyGain: number;
    monthlySpent: number; // Allocation + Debt
    monthlyInvested: number;
}

export const calculateFinancialMetrics = (data: FinancialData): FinancialMetrics => {
    const { income, debts, emergency, allocation, investments, assets, goals, grossSalary, employmentType } = data;

    // Totals
    const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
    const totalDebtPayments = debts.reduce((sum, d) => sum + d.payment, 0);
    const totalInvested = investments.reduce((sum, i) => sum + i.amount, 0);
    const totalAssetsValue = assets.reduce((sum, a) => sum + a.cost, 0);
    const totalGoalsSaved = goals.reduce((sum, g) => sum + g.saved, 0);

    // Net Worth
    // Assets = Emergency Fund + Investments + Physical Assets + Goal Savings
    const totalAssets = emergency.current + totalInvested + totalAssetsValue + totalGoalsSaved;
    const totalLiabilities = totalDebt;
    const netWorth = totalAssets - totalLiabilities;

    // Monthly Flow
    const monthlyGain = income;
    const monthlyInvested = allocation.currentInvestment;
    // We assume allocated spending + debt payments constitutes total outflow for analysis
    const monthlySpent = allocation.currentEssential + allocation.currentEnjoy + totalDebtPayments;

    // Ratios
    const debtRatio = income > 0 ? (totalDebtPayments / income) * 100 : 0;
    const savingsRate = income > 0 ? (monthlyInvested / income) * 100 : 0;
    
    // Emergency Status
    const multiplier = employmentType === 'clt' ? 6 : employmentType === 'civil' ? 3 : 12;
    const emergencyTarget = grossSalary * multiplier;
    const emergencyMonths = grossSalary > 0 ? emergency.current / grossSalary : 0;

    // Health Score Calculation
    let score = 100;
    
    if (income === 0 && grossSalary === 0) {
        score = 0;
    } else {
        // Penalize High Debt
        if (debtRatio > 30) score -= 30;
        else if (debtRatio > 20) score -= 15;
        
        // Penalize Low Emergency Fund
        const emergencyProgress = emergencyTarget > 0 ? emergency.current / emergencyTarget : 0;
        if (emergencyProgress < 0.25) score -= 30;
        else if (emergencyProgress < 0.5) score -= 20;
        else if (emergencyProgress < 1) score -= 10;

        // Penalize Low Investing
        if (savingsRate < 5) score -= 25;
        else if (savingsRate < 10) score -= 15;
        else if (savingsRate >= 20) score += 5;

        // Bonus
        if (debts.length === 0) score += 10;
        if (investments.length >= 2) score += 5;
        if (totalAssets > totalLiabilities * 2) score += 10; // Strong Net Worth
    }

    return {
        totalDebt,
        totalDebtPayments,
        totalInvested,
        totalAssetsValue,
        totalGoalsSaved,
        totalAssets,
        totalLiabilities,
        netWorth,
        debtRatio,
        savingsRate,
        emergencyTarget,
        emergencyMonths,
        score: Math.max(0, Math.min(100, score)),
        monthlyGain,
        monthlySpent,
        monthlyInvested
    };
};
