// app/routes/accounts/$accountId.tsx
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server.v2";
import { getAccount } from "~/utils/accounts.server";
import { getTransactions } from "~/utils/transactions.server";
import { AccountDetails } from "~/components/AccountDetails";
import { TransactionList } from "~/components/TransactionListWithAccount";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const accountId = params.accountId;

  if (!accountId) {
    throw new Response("Not Found", { status: 404 });
  }

  const [account, transactions] = await Promise.all([
    getAccount(userId, accountId),
    getTransactions(userId, {
      accountId,
      limit: 10,
      filterType: "all",
      sortBy: "date",
      page: 1,
      sortOrder: "desc",
    }),
  ]);

  if (!account) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ account, transactions });
};

export default function AccountDetailPage() {
  const { account, transactions } = useLoaderData<typeof loader>();
  const { accountId } = useParams();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-1">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{`Account Details ${
        accountId ? "| " + accountId : ""
      } `}</h1>
      <AccountDetails account={account} transactions={transactions} />
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Transaction History
        </h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
}
