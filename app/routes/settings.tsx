import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/9/settings-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function SettingsPage() {
  return null;
}
