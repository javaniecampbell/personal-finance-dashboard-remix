import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/11/help-support-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function AccountsPage() {
  return null;
}
