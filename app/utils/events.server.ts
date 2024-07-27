// app/models/events.server.js

const mockEvents = [
  { id: 1, type: 'DEPOSIT', amount: 1000, timestamp: '2024-07-26T10:00:00Z' },
  { id: 2, type: 'WITHDRAWAL', amount: 50, timestamp: '2024-07-26T11:30:00Z' },
  { id: 3, type: 'BUDGET_ADJUSTMENT', amount: 200, categoryId: 'groceries', timestamp: '2024-07-26T14:00:00Z' },
  { id: 4, type: 'BILL_PAYMENT', amount: 100, billId: 'electricity', timestamp: '2024-07-26T16:00:00Z' },
  { id: 5, type: 'DEPOSIT', amount: 500, timestamp: '2024-07-26T18:00:00Z' },
];

export async function getRecentEvents() {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In a real application, you would fetch this data from your database or external API
  return mockEvents;
}
