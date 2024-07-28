// app/utils/categoryHelpers.ts

import { TRANSACTION_CATEGORIES, BILL_CATEGORIES, BUDGET_CATEGORIES } from '~/constants/categories';

export function isValidTransactionCategory(category: string): boolean {
  return TRANSACTION_CATEGORIES.includes(category);
}

export function isValidBillCategory(category: string): boolean {
  return BILL_CATEGORIES.includes(category);
}

export function isValidBudgetCategory(category: string): boolean {
  return BUDGET_CATEGORIES.includes(category);
}

export function getCategoryColor(category: string): string {
  // This is a simple example. You might want to define specific colors for each category.
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
  ];
  const index = TRANSACTION_CATEGORIES.indexOf(category);
  return index !== -1 ? colors[index % colors.length] : '#CCCCCC';
}
