import { Budget, BudgetPerformance } from "~/types";
import { db } from "./db.server";

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

export async function getBudgetPerformance(userId: string) {
  const budgets = await db.budget.findMany({
    where: { userId },
    include: {
      transactions: {
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
          },
        },
      },
    },
  });

  return budgets.map(budget => ({
    id: budget.id,
    name: budget.name,
    category: budget.category,
    budgetedAmount: budget.amount,
    actualAmount: budget?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0),
    performance: budget?.transactions?.reduce((sum, transaction) => sum + transaction.amount, 0) / budget.amount,
  })) satisfies BudgetPerformance[];
}


export async function getBudgetOverview(userId: string): Promise<{ budgets: Budget[], performance: BudgetPerformance[] }> {
  const budgets = await getBudgets(userId);
  const performance = await getBudgetPerformance(userId);

  return {
    budgets,
    performance ,
  };
}