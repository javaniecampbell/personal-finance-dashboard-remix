// app/types.ts

export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: Date | null;
};

export type Account = {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
};

export type UserSettings = {
  theme: 'light' | 'dark';
  language: string;
  currency: string;
  notifyOnLowBalance: boolean;
  notifyOnBillDue: boolean;
  notifyOnBudgetExceeded: boolean;
  lowBalanceThreshold: number;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
};

export type Budget = {
  id: string;
  name: string;
  amount: number;
  category: string;
  period: 'weekly' | 'monthly' | 'yearly';
};

export type Bill = {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  status: 'unpaid' | 'paid';
  recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
};

export type SupportTicket = {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
};

export type ConnectedAccount = {
  id: string;
  provider: string;
  accountId: string;
  accountName: string;
  accountType: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type FinancialHealthIndicators = {
  savingsRate: number;
  debtToIncomeRatio: number;
  netWorth: number;
};

export type BudgetPerformance = {
  id: string;
  name: string;
  category: string;
  budgetedAmount: number;
  actualAmount: number;
  performance: number;
};
export type ChartData = {
  [key: string]: string | number;
};

export type SimpleBudgetPerformance = {
  category: string;
  budgeted: number;
  actual: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};


export type Metric = {
  timestamp: string;
  requestCount: number;
  responseTime: number;
  errorRate: number;
};

export type UserBudget = {
  id: string;
  name: string;
  amount: number;
  category: string;
  userId: string;
};


export type BudgetHistoryEntry = {
  id: string;
  budgetId: string;
  date: string; // ISO date string
  budgetedAmount: number;
  actualAmount: number;
  performance: number;
  spentPercentage: number;
};

export type BudgetHistory = {
  id: string;
  name: string;
  category: string;
  history: BudgetHistoryEntry[];
};

export type BudgetOverview = {
  budgets: Budget[];
  performance: BudgetPerformance[];
};

// For the dashboard loader
export type DashboardData = {
  budgetOverview: BudgetOverview;
  budgetHistory: BudgetHistory[];
};

// For the recordBudgetHistory function result
export type RecordBudgetHistoryResult = {
  recordedEntries: number;
  totalBudgets: number;
};