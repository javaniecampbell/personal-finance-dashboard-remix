import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request, params }: LoaderFunctionArgs) {
  throw redirect(`/flow/14/accounts/${params.accountId}`, {
    headers: { "Cache-Control": "no-store" },
  });
}
export function AccountsPage() {
  return null;
}
