import type { User } from "~/types";
import { db } from "./db.server";


export async function getUser(userId: string): Promise<User | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dateOfBirth: true,
    },
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

export async function getUserProfile(userId: string): Promise<User | null> {
  return db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dateOfBirth: true,
    },
  });
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: Date;
  }
): Promise<User> {
  return db.user.update({
    where: { id: userId },
    data: profileData,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      dateOfBirth: true,
    },
  });
}