// app/components/AccountList.tsx
import { Link } from "@remix-run/react";
import { Account } from "~/types";

type AccountListProps = {
  accounts: Account[];
};

export function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {accounts?.map((account) => (
        <div
          key={account.id}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              {/* <div className="flex-shrink-0"> */}
              {/* Add an icon based on account type */}
              {/* </div> */}
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {account.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${account.balance.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                to={`/accounts/${account.id}`}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
