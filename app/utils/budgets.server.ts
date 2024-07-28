import { Budget, BudgetPerformance } from "~/types";
import { db } from "./db.server";
import { endOfMonth, startOfMonth } from "./dateHelpers";

export async function getBudgets(userId: string) {
  return db.budget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createBudget(userId: string, data: {
  name: string;
  amount: number;
  category: string;
  period: 'weekly' | 'monthly' | 'yearly';
}) {
  return db.budget.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateBudget(userId: string, budgetId: string, data: {
  name?: string;
  amount?: number;
  category?: string;
  period?: 'weekly' | 'monthly' | 'yearly';
}) {
  return db.budget.update({
    where: { id: budgetId, userId },
    data,
  });
}

export async function deleteBudget(userId: string, budgetId: string) {
  return db.budget.delete({
    where: { id: budgetId, userId },
  });
}

export async function getBudgetPerformance(userId: string, isCapped: boolean = false, isChangeRate: boolean = false) {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          date: {
            // gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      },
    },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log('Fetched budgets with transactions:', JSON.stringify(budgets, null, 2));
  }

  return budgets.map(budget => {
    const actualAmount = budget?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Budget ${budget.name}: Actual amount = ${actualAmount}`);

    }
    // const performance=  budget?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) / budget.amount;
    let performance: number = 0;

    performance = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
    // Cap performance at 100% if it exceeds 100% and isCapped is true
    if (isCapped && performance > 100) {
      performance = 100; // Cap at 100%
    } else if (isChangeRate === true) {
      // This can now be positive (over budget) or negative (under budget)
      performance = budget.amount > 0 ? ((actualAmount - budget.amount) / budget.amount) * 100 : 0;
    }

    return {
      id: budget.id,
      name: budget.name,
      category: budget.category,
      budgetedAmount: budget.amount,
      actualAmount,
      performance,
    } satisfies BudgetPerformance;
  }) satisfies BudgetPerformance[];
}

// app/utils/budgets.server.ts
/**
 * Budget Performance:
 * Categories allow us to compare actual spending against budgeted amounts
 * @param userId 
 * @param month 
 * @returns 
 */
export async function getBudgetPerformanceByMonth(userId: string, month: Date) {
  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          date: {
            gte: startOfMonth(month),
            lt: endOfMonth(month)
          }
        }
      }
    }
  });

  return budgets.map(budget => ({
    category: budget.category,
    budgeted: budget.amount,
    spent: budget.transactions.reduce((sum, t) => sum + t.amount, 0)
  }));
}

export async function getBudgetOverview(userId: string): Promise<{ budgets: Budget[], performance: BudgetPerformance[] }> {
  const budgets = await getBudgets(userId);
  const performance = await getBudgetPerformance(userId);

  return {
    budgets,
    performance,
  };
}