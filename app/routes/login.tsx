import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/2/login-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function Login() {
  return null;
}
