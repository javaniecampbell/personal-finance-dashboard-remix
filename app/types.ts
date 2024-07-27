// app/types.ts

export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  dateOfBirth: Date | null;
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

export type ChartData = {
  [key: string]: string | number;
};

export type BudgetPerformance = {
  category: string;
  budgeted: number;
  actual: number;
};

export type DateRange = {
  start: Date;
  end: Date;
};
