// app/routes/accounts/index.tsx
import React, { useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json, LoaderFunction, ActionFunction } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server.v2';
import { getAccounts, createAccount, updateAccount, deleteAccount } from '~/utils/accounts.server';
import { AccountList } from '~/components/AccountList';
import { AccountForm } from '~/components/AccountForm';

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const accounts = await getAccounts(userId);
  return json({ accounts });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "create":
      return json(await createAccount(userId, values));
    case "update":
      return json(await updateAccount(values.id, values));
    case "delete":
      return json(await deleteAccount(values.id));
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};

export default function AccountManagement() {
  const { accounts } = useLoaderData();
  const [editingAccount, setEditingAccount] = useState(null);
  const fetcher = useFetcher();

  const handleSubmit = (event) => {
    event.preventDefault();
    fetcher.submit(event.target);
    setEditingAccount(null);
  };

  const handleDelete = (accountId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      fetcher.submit(
        { _action: "delete", id: accountId },
        { method: "post" }
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">
          {editingAccount ? 'Edit Account' : 'Create New Account'}
        </h2>
        <AccountForm 
          account={editingAccount} 
          onSubmit={handleSubmit}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Your Accounts</h2>
        <AccountList 
          accounts={accounts} 
          onEdit={setEditingAccount}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
