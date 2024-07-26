import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId, getUser } from "~/utils/auth.server";
import Layout from "~/components/Layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const user = await getUser(request);
  return json({ user });
};

export default function DashboardIndex() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700">
        Welcome to the Dashboard, {user?.username}!
      </h2>
      <p className="mt-2 text-gray-600">
        This is where your main content will be displayed.
      </p>
    </Layout>
  );
}
