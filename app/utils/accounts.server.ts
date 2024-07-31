import { db } from "~/utils/db.server";
import type { Account } from "@prisma/client";
import { validateAccount } from "./account.validation.server";

export async function getAccounts(userId: string) {
  return db.account.findMany({
    where: { userId },
    include: { transactions: true },
  });
}

export async function createAccount(userId: string, accountData: Omit<Account, "id" | "userId">) {
  const validationResult = validateAccount(accountData);
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }
  return db.account.create({
    data: {
      ...accountData,
      userId,
    },
  });
}

export async function updateAccount(userId: string, accountId: string, accountData: Partial<Account>) {

  const validationResult = validateAccount(accountData);

  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }


  return db.account.update({
    where: { id: accountId, userId },
    data: validateAccount.data,
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
    // return transaction.type === 'INCOME' ? sum + transaction.amount : sum - transaction.amount;
    return transaction.type === 'income' ? sum + transaction.amount : sum - transaction.amount;
  }, 0);

  return balance;
}
