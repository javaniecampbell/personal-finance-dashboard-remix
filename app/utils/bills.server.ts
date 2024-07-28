import type { Bill } from "~/types";
import { db } from "./db.server";
import { BillFrequency } from "@prisma/client";

export async function getBills(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: keyof Bill;
    sortOrder?: 'asc' | 'desc';
    status?: 'paid' | 'unpaid' | 'all';
  } = {}
) {
  const {
    page = 1,
    limit = 10,
    sortBy = 'dueDate',
    sortOrder = 'asc',
    status = 'all'
  } = options;

  const skip = (page - 1) * limit;

  const whereClause: any = { userId };
  if (status !== 'all') {
    whereClause.status = status;
  }

  const [bills, totalCount] = await Promise.all([
    db.bill.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    db.bill.count({ where: whereClause }),
  ]);

  const billData: Bill[] = bills.map((bill) => ({
    id: bill.id,
    name: bill.name,
    amount: bill.amount,
    dueDate: bill.dueDate,
    category: bill.category,
    status: bill.status as 'paid' | 'unpaid',
    recurring: bill.recurring,
    frequency: bill.frequency as BillFrequency,
  }));
  return {
    bills: billData,
    totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}
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
/**
 * Bill Categorization:
 * Categorizing bills can help users understand their fixed expenses:
 */
export async function getBillsByCategory(userId: string) {
  return db.bill.groupBy({
    by: ['category'],
    where: { userId },
    _sum: {
      amount: true
    },
    _count: true
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
      status: 'unpaid',
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
  return await db.bill.delete({
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
  const updated = await db.bill.update({
    where: { id: billId, userId },
    data: {
      amount: amount,
      status: 'paid',
      dueDate: paymentDate,
      // frequency: BillFrequency.monthly
    },
  });

  return {
    id: updated.id,
    name: updated.name,
    amount: updated.amount,
    dueDate: updated.dueDate,
    category: updated.category,
    status: updated.status as 'paid' | 'unpaid',
    recurring: updated.recurring,
    frequency: updated.frequency as 'weekly' | 'monthly' | 'yearly',
  };
}

