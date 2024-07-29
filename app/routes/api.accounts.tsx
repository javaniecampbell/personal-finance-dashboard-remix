// app/routes/api/accounts.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "~/utils/accounts.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);
  return json(accounts);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "create":
      return json(await createAccount(userId, values));
    case "update":
      return json(await updateAccount(values.id as string, values));
    case "delete":
      return json(await deleteAccount(values.id as string));
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};
