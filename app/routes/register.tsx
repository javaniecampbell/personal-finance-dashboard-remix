import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ request }: LoaderFunctionArgs) {
  throw redirect("/flow/3/registration-page", {
    headers: { "Cache-Control": "no-store" },
  });
}
export function Register() {
  return null;
}
