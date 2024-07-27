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


export async function getRecentTransactions(userId: string, limit: number) {
  return db.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
  });
}

export async function getAccountBalance(userId: string) {
  const accounts = await db.account.findMany({
    where: { userId },
    select: { balance: true },
  });

  return accounts.reduce((sum, account) => sum + account.balance, 0);
}