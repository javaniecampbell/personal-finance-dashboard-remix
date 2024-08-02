import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/10/profile-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function ProfilePage() {
  return null;
}
