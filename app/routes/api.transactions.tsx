// app/routes/api/transactions.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import {
  getTransactions,
  createTransaction,
} from "~/utils/transactions.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const accountId = url.searchParams.get("accountId");
  const transactions = await getTransactions(userId, { accountId });
  return json(transactions);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const transactionData = Object.fromEntries(formData);

  return json(await createTransaction(userId, transactionData));
};
