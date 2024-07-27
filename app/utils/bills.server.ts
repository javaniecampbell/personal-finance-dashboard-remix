import type { Bill } from "~/types";
import { db } from "./db.server";
import { BillFrequency } from "@prisma/client";

export async function getUpcomingBills(userId: string) {
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.setDate(today.getDate() + 30));

  return db.bill.findMany({
    where: {
      userId,
      dueDate: {
        gte: new Date(),
        lte: thirtyDaysFromNow,
      },
      status: 'unpaid',
    },
    orderBy: { dueDate: 'asc' },
  });
}

export async function getBillHistory(userId: string) {
  return db.bill.findMany({
    where: {
      userId,
      status: 'paid',
    },
    orderBy: { paidDate: 'desc' },
    take: 10,
  });
}

export async function createBill(userId: string, data: {
  name: string;
  amount: number;
  dueDate: Date;
  category: string;
  recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
}) {
  return db.bill.create({
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
  });
}

export async function updateBill(userId: string, billId: string, data: {
  name?: string;
  amount?: number;
  dueDate?: Date;
  category?: string;
  recurring?: boolean;
  frequency?: 'weekly' | 'monthly' | 'yearly';
  status?: 'paid' | 'unpaid';
}) {
  return db.bill.update({
    where: { id: billId, userId },
    data,
  });
}

export async function deleteBill(userId: string, billId: string) {
  return db.bill.delete({
    where: { id: billId, userId },
  });
}

export async function payBill(userId: string, billId: string, paymentDate: Date) {
  return db.bill.update({
    where: { id: billId, userId },
    data: {
      status: 'paid',
      paidDate: paymentDate,
    },
  });
}

export async function scheduleBillPayment(userId: string, billId: string, amount: number, paymentDate: Date): Promise<Bill> {
  return await db.bill.update({
    where: { id: billId, userId },
    data: {
      amount: amount,
      status: 'paid',
      dueDate: paymentDate,
      // frequency: BillFrequency.monthly
    },
  });
}
