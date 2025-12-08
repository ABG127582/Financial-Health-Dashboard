
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { FinancialData, Action } from './types';

const APP_STORAGE_KEY = 'financialDashboardData';

export const defaultFinancialData: FinancialData = {
    income: 0,
    age: 0,
    employmentType: '',
    grossSalary: 0,
    allocation: {
        currentEssential: 0,
        currentInvestment: 0,
        currentEnjoy: 0,
    },
    emergency: {
        current: 0,
    },
    expenses: [],
    investments: [],
    assets: [],
    debts: [],
    goals: [],
    extraIncomes: [],
    events: [],
};

// Helper to sanitize data and ensure all arrays exist
const sanitizeData = (data: any): FinancialData => {
    return {
        ...defaultFinancialData,
        ...data,
        allocation: { ...defaultFinancialData.allocation, ...(data.allocation || {}) },
        emergency: { ...defaultFinancialData.emergency, ...(data.emergency || {}) },
        expenses: Array.isArray(data.expenses) ? data.expenses : [],
        investments: Array.isArray(data.investments) ? data.investments : [],
        assets: Array.isArray(data.assets) ? data.assets : [],
        debts: Array.isArray(data.debts) ? data.debts : [],
        goals: Array.isArray(data.goals) ? data.goals : [],
        extraIncomes: Array.isArray(data.extraIncomes) ? data.extraIncomes : [],
        events: Array.isArray(data.events) ? data.events : [],
    };
};

// Reducer for state management
const financialDataReducer = (state: FinancialData, action: Action): FinancialData => {
    switch (action.type) {
        case 'SET_DATA':
            return action.payload;
        case 'UPDATE_FIELD':
            if (action.payload.key === 'emergency') {
                 return { ...state, emergency: { ...state.emergency, ...action.payload.value } };
            }
            if (action.payload.key === 'allocation') {
                 return { ...state, allocation: { ...state.allocation, ...action.payload.value } };
            }
            return { ...state, [action.payload.key]: action.payload.value };
        case 'ADD_ITEM': {
            const listKey = action.payload.list;
            const list = state[listKey] as any[];
            return { ...state, [listKey]: [...list, action.payload.item] };
        }
        case 'REMOVE_ITEM': {
            const listKey = action.payload.list;
            const list = state[listKey] as any[];
            return { ...state, [listKey]: list.filter(item => item.id !== action.payload.id) };
        }
        case 'RESET_DATA':
            return defaultFinancialData;
        case 'IMPORT_DATA':
            return sanitizeData(action.payload);
        default:
            return state;
    }
};

// Context Creation
const FinancialDataContext = createContext<FinancialData>(defaultFinancialData);
const FinancialDataDispatchContext = createContext<React.Dispatch<Action>>(() => null);

// Provider Component
export const FinancialDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [financialData, dispatch] = useReducer(financialDataReducer, defaultFinancialData, (initialState) => {
        try {
            const savedData = localStorage.getItem(APP_STORAGE_KEY);
            if (!savedData) return initialState;
            const parsed = JSON.parse(savedData);
            return sanitizeData(parsed);
        } catch (error) {
            console.error("Failed to parse financial data from localStorage", error);
            return initialState;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(financialData));
        } catch (error) {
            console.error("Failed to save financial data to localStorage", error);
        }
    }, [financialData]);

    return (
        <FinancialDataContext.Provider value={financialData}>
            <FinancialDataDispatchContext.Provider value={dispatch}>
                {children}
            </FinancialDataDispatchContext.Provider>
        </FinancialDataContext.Provider>
    );
};

// Custom Hooks
export const useFinancialData = () => useContext(FinancialDataContext);
export const useFinancialDispatch = () => useContext(FinancialDataDispatchContext);
