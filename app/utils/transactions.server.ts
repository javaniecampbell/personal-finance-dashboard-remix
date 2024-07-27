import type { Account, Transaction } from "~/types";
import { db } from "./db.server";

export async function getTransactions(userId: string, options: {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filterType: string;
}) {
  const { page, limit, sortBy, sortOrder, filterType } = options;
  const skip = (page - 1) * limit;

  const where = { userId };
  if (filterType !== 'all') {
    where.type = filterType;
  }

  const [transactions, totalCount] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    db.transaction.count({ where }),
  ]);

  return { transactions, totalCount };
}

export async function createTransaction(userId: string, data: {
  description: string;
  amount: number;
  date: Date;
  category: string;
  type: 'income' | 'expense';
}) {
  return db.transaction.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
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