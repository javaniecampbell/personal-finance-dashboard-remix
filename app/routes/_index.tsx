import {
  LoaderFunctionArgs,
  redirect,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ _request }: LoaderFunctionArgs) {
  throw redirect("/flow/1/landing-page", {
    headers: { "Cache-Control": "no-store" },
  });
}

export default function Index() {
  return null;
}
