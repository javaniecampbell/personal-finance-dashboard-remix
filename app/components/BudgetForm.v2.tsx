// app/components/BudgetForm.tsx
import React from 'react';
import { Form } from '@remix-run/react';

export function BudgetForm({ accounts, budget, onSubmit }) {
  const isEditing = !!budget;

  return (
    <Form method="post" onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="_action" value={isEditing ? "update" : "create"} />
      {isEditing && <input type="hidden" name="id" value={budget.id} />}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Budget Name</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={budget?.name}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          defaultValue={budget?.amount}
          required
          step="0.01"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          defaultValue={budget?.category}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period</label>
        <select
          id="period"
          name="period"
          defaultValue={budget?.period || 'monthly'}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Associated Accounts</label>
        <div className="mt-2 space-y-2">
          {accounts.map((account) => (
            <div key={account.id} className="flex items-center">
              <input
                type="checkbox"
                id={`account-${account.id}`}
                name="accountIds"
                value={account.id}
                defaultChecked={budget?.accounts?.some(a => a.id === account.id)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor={`account-${account.id}`} className="ml-2 block text-sm text-gray-900">
                {account.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isEditing ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </Form>
  );
}
