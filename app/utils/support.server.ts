import { db } from "./db.server";

export async function getFAQs() {
  return db.faq.findMany({
    orderBy: { order: 'asc' },
  });
}

export async function submitSupportTicket(userId: string, ticketData: {
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}) {
  return db.supportTicket.create({
    data: {
      ...ticketData,
      status: 'open',
      user: { connect: { id: userId } },
    },
  });
}

export async function getSupportTickets(userId: string) {
  return db.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateSupportTicket(ticketId: string, updateData: {
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  response?: string;
}) {
  return db.supportTicket.update({
    where: { id: ticketId },
    data: updateData,
  });
}
