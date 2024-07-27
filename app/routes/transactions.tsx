import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/5/transactions-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function TransactionsPage() {
  return null;
}
