import { FinancialHealthIndicators } from "~/types";
import { db } from "./db.server";

export async function getIncomeVsExpenses(userId: string, startDate: Date, endDate: Date) {
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      amount: true,
      type: true,
    },
  });

  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = transaction.date.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { income: 0, expenses: 0 };
    }
    if (transaction.type === 'income') {
      acc[date].income += transaction.amount;
    } else {
      acc[date].expenses += transaction.amount;
    }
    return acc;
  }, {});

  return Object.entries(dailyTotals).map(([date, { income, expenses }]) => ({
    date,
    income,
    expenses,
  }));
}

export async function getSpendingByCategory(userId: string, startDate: Date, endDate: Date) {
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
      type: 'expense',
    },
    select: {
      category: true,
      amount: true,
    },
  });

  const categoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));
}

export async function getSavingsTrend(userId: string, startDate: Date, endDate: Date) {
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      date: true,
      amount: true,
      type: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  let runningTotal = 0;
  return transactions.reduce((acc, transaction) => {
    const date = transaction.date.toISOString().split('T')[0];
    runningTotal += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    acc.push({ date, savings: runningTotal });
    return acc;
  }, []);
}

export async function getNetWorth(userId: string) {
  const assets = await db.account.aggregate({
    where: {
      userId,
      type: 'asset',
    },
    _sum: {
      balance: true,
    },
  });

  const liabilities = await db.account.aggregate({
    where: {
      userId,
      type: 'liability',
    },
    _sum: {
      balance: true,
    },
  });

  return (assets._sum.balance || 0) - (liabilities._sum.balance || 0);
}

export async function getFinancialHealthIndicators(userId: string) {
  const totalIncome = await db.transaction.aggregate({
    where: {
      userId,
      type: 'income',
      date: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalExpenses = await db.transaction.aggregate({
    where: {
      userId,
      type: 'expense',
      date: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const netWorth = await getNetWorth(userId);

  return {
    savingsRate: 1 - (totalExpenses._sum.amount || 0) / (totalIncome._sum.amount || 1),
    debtToIncomeRatio: await getDebtToIncomeRatio(userId),
    netWorth,
  };
}

export async function getFinancialMetrics(userId: string): Promise<FinancialHealthIndicators> {
  const totalIncome = await db.transaction.aggregate({
    where: {
      userId,
      type: 'income',
      date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
    },
    _sum: { amount: true },
  });

  const totalExpenses = await db.transaction.aggregate({
    where: {
      userId,
      type: 'expense',
      date: { gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) },
    },
    _sum: { amount: true },
  });

  const totalAssets = await db.account.aggregate({
    where: { userId, type: { in: ['checking', 'savings', 'investment'] } },
    _sum: { balance: true },
  });

  const totalLiabilities = await db.account.aggregate({
    where: { userId, type: { in: ['credit', 'loan'] } },
    _sum: { balance: true },
  });

  const income = totalIncome._sum.amount || 0;
  const expenses = totalExpenses._sum.amount || 0;
  const assets = totalAssets._sum.balance || 0;
  const liabilities = totalLiabilities._sum.balance || 0;

  return {
    savingsRate: income > 0 ? (income - expenses) / income : 0,
    debtToIncomeRatio: income > 0 ? liabilities / income : 0,
    netWorth: assets - liabilities,
  };
}

async function getDebtToIncomeRatio(userId: string) {
  const monthlyIncome = await db.transaction.aggregate({
    where: {
      userId,
      type: 'income',
      date: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const totalDebt = await db.account.aggregate({
    where: {
      userId,
      type: 'liability',
    },
    _sum: {
      balance: true,
    },
  });

  return (totalDebt._sum.balance || 0) / (monthlyIncome._sum.amount || 1);
}
