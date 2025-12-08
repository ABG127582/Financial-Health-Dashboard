
export type Tab = 'overview' | 'allocation' | 'emergency' | 'investments' | 'assets' | 'debts' | 'goals';

export interface Investment {
    id: number;
    type: string;
    amount: number;
    returnRate: number;
}

export interface Asset {
    id: number;
    name: string;
    category: string;
    age: number;
    cost: number;
}

export interface Debt {
    id: number;
    name: string;
    amount: number;
    interest: number;
    payment: number;
}

export interface Goal {
    id: number;
    title: string;
    amount: number;
    deadline: string;
    saved: number;
}

export interface ExtraIncome {
    id: number;
    name: string;
    amount: number;
    use: string;
}

export interface PlannedEvent {
    id: number;
    name: string;
    cost: number;
    date: string;
}

export interface Expense {
    id: number;
    name: string;
    amount: number;
    category: 'essential' | 'lifestyle';
}

export interface FinancialData {
    income: number;
    age: number;
    employmentType: string;
    grossSalary: number;
    allocation: {
        currentEssential: number;
        currentInvestment: number;
        currentEnjoy: number;
    };
    emergency: {
        current: number;
    };
    expenses: Expense[];
    investments: Investment[];
    assets: Asset[];
    debts: Debt[];
    goals: Goal[];
    extraIncomes: ExtraIncome[];
    events: PlannedEvent[];
}

export type FinancialDataKey = keyof FinancialData;

export interface IconProps {
    className?: string;
}

type ItemList = 'investments' | 'assets' | 'debts' | 'goals' | 'extraIncomes' | 'events' | 'expenses';
type ItemType<T extends ItemList> = FinancialData[T][0];

export type Action =
    | { type: 'SET_DATA'; payload: FinancialData }
    | { type: 'UPDATE_FIELD'; payload: { key: FinancialDataKey; value: any } }
    | { type: 'ADD_ITEM'; payload: { list: 'investments'; item: Investment } }
    | { type: 'ADD_ITEM'; payload: { list: 'assets'; item: Asset } }
    | { type: 'ADD_ITEM'; payload: { list: 'debts'; item: Debt } }
    | { type: 'ADD_ITEM'; payload: { list: 'goals'; item: Goal } }
    | { type: 'ADD_ITEM'; payload: { list: 'extraIncomes'; item: ExtraIncome } }
    | { type: 'ADD_ITEM'; payload: { list: 'events'; item: PlannedEvent } }
    | { type: 'ADD_ITEM'; payload: { list: 'expenses'; item: Expense } }
    | { type: 'REMOVE_ITEM'; payload: { list: ItemList; id: number } }
    | { type: 'RESET_DATA' }
    | { type: 'IMPORT_DATA'; payload: FinancialData };
