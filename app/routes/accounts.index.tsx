import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/13/accounts", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function AccountsPage() {
  return null;
}
