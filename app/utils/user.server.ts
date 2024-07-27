import { db } from "./db.server";

export async function getUser(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
  });
}

export async function getUserById(userId: string) {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
}

export async function updateUser(userId: string, data: { name?: string; email?: string }) {
  return db.user.update({
    where: { id: userId },
    data,
  });
}

export async function getUserDashboardData(userId: string) {
  const user = await getUserById(userId);
  const recentTransactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: 5,
  });
  const accountBalances = await db.account.findMany({
    where: { userId },
    select: { id: true, name: true, balance: true },
  });

  return {
    user,
    recentTransactions,
    accountBalances,
  };
}
