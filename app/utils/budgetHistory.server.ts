
import { db } from "./db.server";
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, endOfDay } from 'date-fns';

export async function getBudgetHistory(userId: string, startDate: Date, endDate: Date) {
  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      history: {
        where: {
          date: {
            gte: startOfMonth(startDate),
            lte: endOfMonth(endDate),
          },
        },
        orderBy: { date: 'asc' },
      },
    },
  });

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  return budgets.map(budget => {
    const historyMap = new Map(budget.history.map(h => [h.date.toISOString().split('T')[0], h]));

    return {
      id: budget.id,
      name: budget.name,
      category: budget.category,
      history: dateRange.map(date => {
        const isoDate = date.toISOString().split('T')[0];
        const historyEntry = historyMap.get(isoDate);
        return {
          date: isoDate,
          budgetedAmount: historyEntry?.budgetedAmount || budget.amount,
          actualAmount: historyEntry?.actualAmount || 0,
          performance: historyEntry?.performance || 0,
        };
      }),
    };
  });
}

export async function recordBudgetHistory(userId: string, date: Date = new Date()) {
  const startOfPeriod = startOfDay(date);
  const endOfPeriod = endOfDay(date);

  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          date: {
            gte: startOfPeriod,
            lte: endOfPeriod,
          },
        },
      },
    },
  });

  const historyEntries = budgets.map(budget => {
    const actualAmount = budget.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const performance = budget.amount > 0 ? ((actualAmount - budget.amount) / budget.amount) * 100 : 0;

    return {
      budgetId: budget.id,
      date: startOfPeriod,
      budgetedAmount: budget.amount,
      actualAmount,
      performance,
    };
  });

  const result = await db.budgetHistory.createMany({
    data: historyEntries,
    skipDuplicates: true, // This will skip if an entry for this budget and date already exists
  });

  return {
    recordedEntries: result.count,
    totalBudgets: budgets.length,
  };
}
