import { db } from "~/utils/db.server";
import type { Account } from "@prisma/client";

export async function getAccounts(userId: string) {
  return db.account.findMany({
    where: { userId },
    include: { transactions: true },
  });
}

export async function createAccount(userId: string, accountData: Omit<Account, "id" | "userId">) {
  return db.account.create({
    data: {
      ...accountData,
      userId,
    },
  });
}

export async function updateAccount(accountId: string, accountData: Partial<Account>) {
  return db.account.update({
    where: { id: accountId },
    data: accountData,
  });
}

export async function deleteAccount(accountId: string) {
  return db.account.delete({
    where: { id: accountId },
  });
}

export async function getAccountBalance(accountId: string) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    include: { transactions: true },
  });

  if (!account) {
    throw new Error("Account not found");
  }

  const balance = account.transactions.reduce((sum, transaction) => {
    return transaction.type === 'INCOME' ? sum + transaction.amount : sum - transaction.amount;
  }, 0);

  return balance;
}
