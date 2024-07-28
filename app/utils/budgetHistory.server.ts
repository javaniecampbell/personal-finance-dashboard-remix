
import { BudgetHistory, RecordBudgetHistoryResult } from "~/types";
import { db } from "./db.server";
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, endOfDay, eachMonthOfInterval, isValid } from 'date-fns';

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
          spentPercentage: historyEntry?.spentPercentage || 0,
        };
      }),
    };
  });
}

export async function getBudgetHistoryByMonth(userId: string, startDate: Date, endDate: Date) {
  // Validate input dates

  console.log('startDate', startDate);
  console.log('endDate', endDate);
  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error('Invalid date range provided');
  }
  const start = startOfMonth(startDate);
  const end = endOfMonth(endDate);

  if (start > end) {
    throw new Error('Start date must be before end date');
  }

  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          date: {
            gte: start,
            lte: end,
          },
        },
      },
    },
  });

  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  return budgets.map(budget => {
    const history = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const budgetedAmount = budget.amount; // Assuming budget.amount is monthly

      const actualAmount = budget.transactions
        .filter(t => t.date >= monthStart && t.date <= monthEnd)
        .reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);

      const performance = budgetedAmount > 0 ? ((actualAmount - budgetedAmount) / budgetedAmount) * 100 : 0;
      const spentPercentage = budgetedAmount > 0 ? (actualAmount / budgetedAmount) * 100 : 0;

      return {
        date: monthStart.toISOString(),
        budgetedAmount,
        actualAmount,
        performance,
        spentPercentage,
      };
    });

    return {
      id: budget.id,
      name: budget.name,
      category: budget.category,
      history,
    };
  });
}

export async function recordBudgetHistory(userId: string, date: Date = new Date()): Promise<RecordBudgetHistoryResult> {
  const startOfPeriod = startOfMonth(date);
  const endOfPeriod = endOfMonth(date);

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
    // Actual amount is the sum of all transactions in the period is currently coming back as 0, this is incorrect
    // const actualAmount = budget.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    // Fix the actual amount calculation summing only expenses if the amount is negative
    // const actualAmount = budget.transactions.reduce((sum, transaction) => {
    //   // Only sum expenses (negative amounts) for budget tracking
    //   return transaction.amount < 0 ? sum + Math.abs(transaction.amount) : sum;
    // }, 0);

    // Fix the actual amount calculation summing only expenses based on the transaction type
    const actualAmount = budget.transactions.reduce((sum, transaction) => {
      // Only sum expenses for budget tracking
      return transaction.type === 'expense' ? sum + transaction.amount : sum;
    }, 0);
    const performance = budget.amount > 0 ? ((actualAmount - budget.amount) / budget.amount) * 100 : 0; //This calculation gives the percentage over or under budget.
    const spentPercentage = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0; // This calculation gives the percentage of the budget that has been spent.
    if (process.env.NODE_ENV === 'development') {
      console.log('acutalAmount', actualAmount);
    }


    return {
      budgetId: budget.id,
      date: endOfPeriod, // We're recording for the entire month
      budgetedAmount: budget.amount,
      actualAmount,
      performance,
      spentPercentage,
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
