import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/8/analytics-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function AnalyticssPage() {
  return null;
}
