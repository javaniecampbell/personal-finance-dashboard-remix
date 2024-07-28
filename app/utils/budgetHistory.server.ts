import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

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
