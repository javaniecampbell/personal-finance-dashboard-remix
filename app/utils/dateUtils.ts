export function getDateRange(range: '1M' | '3M' | '6M' | '1Y') {
  const end = new Date();
  let start = new Date();

  switch (range) {
    case '1M':
      start.setMonth(start.getMonth() - 1);
      break;
    case '3M':
      start.setMonth(start.getMonth() - 3);
      break;
    case '6M':
      start.setMonth(start.getMonth() - 6);
      break;
    case '1Y':
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return { start, end };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getMonthName(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[monthIndex];
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
