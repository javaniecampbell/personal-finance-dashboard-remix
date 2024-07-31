// app/utils/validation.server.ts
import { z } from 'zod';

export const accountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100, "Account name must be 100 characters or less"),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT']),
  balance: z.number().min(0, "Balance must be a positive number"),
});

export function validateAccount(data: unknown) {
  return accountSchema.safeParse(data);
}
