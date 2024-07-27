import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/6/budget-management-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function BudgetsPage() {
  return null;
}
