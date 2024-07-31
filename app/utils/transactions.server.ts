import type { Account, Transaction, TransactionType } from "~/types";
import { db } from "./db.server";

export async function getTransactions(userId: string, options: {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterType: string;
  accountId?: string;
}) {
  const { page, limit, sortBy, sortOrder, filterType } = options;
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(options.accountId ? { accountId: options.accountId } : {})
  };
  if (filterType !== 'all') {
    where.type = filterType;
  }

  const [transactions, totalCount] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
      include: { account: true },
    }),
    db.transaction.count({ where }),
  ]);

  return { transactions, totalCount };
}

export async function createTransaction(userId: string, transactionData: {
  budgetId?: string;
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: TransactionType;
  accountId: string;
  toAccountId?: string;
}) {
  const { budgetId, ...data } = transactionData;

  if (data.type === 'transfer') {
    // SCENARIO: 1. Transfer between two accounts of the same user

    // SCENARIO: 2. Transfer from an account to a budget
    // SCENARIO: 3. Transfer from a budget to an account
    // SCENARIO: 4. Transfer between two budgets
    // SCENARIO: 5. Transfer between two users
    // SCENARIO: 6. Transfer from a user to a budget
    // SCENARIO: 7. Transfer from a budget to a user
    // SCENARIO: 8. Transfer between two users and a budget
    // SCENARIO: 9. Transfer between two budgets and a user
    // SCENARIO: 10. Transfer between two users and two budgets
    // SCENARIO: 11. Transfer between two budgets and two users
    // PRIORITY: 12. Transfer between two accounts of the same user and a budget

    // Create two transactions for transfer
    const [fromTransaction, toTransaction] = await db.$transaction([
      db.transaction.create({
        data: {
          type: 'expense',
          amount: -data.amount,
          description: data.description,
          date: new Date(data.date),
          category: 'Transfer',
          user: { connect: { id: userId } },
          account: { connect: { id: data.accountId } },
        },
      }),
      db.transaction.create({
        data: {
          type: 'income',
          amount: data.amount,
          description: data.description,
          date: new Date(data.date),
          category: 'Transfer',
          user: { connect: { id: userId } },
          account: { connect: { id: data.toAccountId } },
        },
      }),
    ]);

    // Update account balances
    await db.$transaction([
      db.account.update({
        where: { id: data.accountId },
        data: { balance: { decrement: data.amount } },
      }),
      db.account.update({
        where: { id: data.toAccountId },
        data: { balance: { increment: data.amount } },
      }),
    ]);

    return { fromTransaction, toTransaction };

  } else {

    // Find the appropriate budget based on the transaction's category
    const budget = await db.budget.findFirst({
      where: {
        userId,
        category: data.category,
      },
    });

    const transaction = await db.transaction.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
        budget: budget ? { connect: { id: budget?.id } } : budgetId !== undefined ? budgetId : undefined : undefined, // Link the transaction to the budget if it exists
        account: { connect: { id: data.accountId } },
      },
    });

    // Update account balance
    await db.account.update({
      where: { id: data.accountId, userId },
      data: {
        balance: data.type === 'expense'
          ? { decrement: data.amount }
          : { increment: data.amount },
      },
    });

    return transaction;
  }
}

export async function updateTransactionsBudgets(userId: string) {
  // Step 1: Get all transactions for the user that don't have a budgetId
  const transactions = await db.transaction.findMany({
    where: {
      userId,
      budgetId: null, // Only get transactions without a budget
    },
  });

  // Step 2: Get all budgets for the user
  const budgets = await db.budget.findMany({
    where: { userId },
  });

  // Step 3: Create a map of category to budget ID for quick lookup
  const categoryToBudgetMap = new Map(
    budgets.map(budget => [budget.category, budget.id])
  );

  // Step 4: Update transactions
  const updates = transactions.map(transaction => {
    const budgetId = categoryToBudgetMap.get(transaction.category);
    if (budgetId) {
      return db.transaction.update({
        where: { id: transaction.id },
        data: { budgetId },
      });
    }
    // If no matching budget found, we'll skip this transaction
    return Promise.resolve(null);
  });

  // Step 5: Execute all updates
  const results = await Promise.all(updates);

  // Step 6: Count successful updates
  const updatedCount = results.filter(result => result !== null).length;

  return {
    totalTransactions: transactions.length,
    updatedTransactions: updatedCount,
  };
}


export async function updateTransaction(userId: string, transactionId: string, data: {
  description?: string;
  amount?: number;
  date?: Date;
  category?: string;
  type?: 'income' | 'expense';
}) {
  return db.transaction.update({
    where: { id: transactionId, userId },
    data,
  });
}

export async function deleteTransaction(userId: string, transactionId: string) {
  return db.transaction.delete({
    where: { id: transactionId, userId },
  });
}

export async function importTransactions(userId: string, transactions: Array<{
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
}>) {
  return db.transaction.createMany({
    data: transactions.map(transaction => ({
      ...transaction,
      userId,
    })),
  });
}


export async function getRecentTransactions(userId: string, limit: number = 5): Promise<Transaction[]> {
  return db.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    include: { account: true },
  });
}

export async function getAccountBalance(userId: string): Promise<number> {
  const accounts = await db.account.findMany({
    where: {
      userId: userId,
    },
    select: {
      balance: true,
      type: true,
    },
  });

  return accounts.reduce((total, account) => {
    // Add balances from asset accounts (checking, savings, investment)
    if (['checking', 'savings', 'investment'].includes(account.type)) {
      return total + account.balance;
    }
    // Subtract balances from liability accounts (credit, loan)
    else if (['credit', 'loan'].includes(account.type)) {
      return total - account.balance;
    }
    return total;
  }, 0);
}

export async function getAccountBalanceByType(userId: string): Promise<{ [key: string]: number }> {
  const accounts = await db.account.findMany({
    where: {
      userId: userId,
    },
    select: {
      balance: true,
      type: true,
    },
  });

  return accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = 0;
    }
    acc[account.type] += account.balance;
    return acc;
  }, {} as { [key: string]: number });
}

export async function getAccountBalanceByAccountId(userId: string, accountId: string): Promise<number> {
  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: userId,
    },
    select: {
      balance: true,
    },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  return account.balance;
}

export async function getAllAccountBalances(userId: string): Promise<Account[]> {
  const accounts = await db.account.findMany({
    where: {
      userId: userId,
    },
  });

  return accounts;
}