// app/components/AccountForm.tsx
import React from 'react';
import { Form } from '@remix-run/react';

export function AccountForm({ account, onSubmit }) {
  const isEditing = !!account;

  return (
    <Form method="post" onSubmit={onSubmit}>
      <input type="hidden" name="_action" value={isEditing ? "update" : "create"} />
      {isEditing && <input type="hidden" name="id" value={account.id} />}
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Account Name</label>
          <input
            type="text"
            name="name"
            id="name"
            defaultValue={account?.name}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
    
        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
          <input
            type="text"
            name="accountNumber"
            id="accountNumber"
            defaultValue={account?.accountNumber}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Account Type</label>
          <select
            id="type"
            name="type"
            defaultValue={account?.type}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit Card</option>
            <option value="investment">Investment</option>
          </select>
        </div>

        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">Initial Balance</label>
          <input
            type="number"
            name="balance"
            id="balance"
            defaultValue={account?.balance || 0}
            step="0.01"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">Bank</label>
          <input
            type="text"
            name="bankName"
            id="bankName"
            defaultValue={account?.bankName || ''}
            required={false}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">Branch</label>
          <input
            type="text"
            name="branchName"
            id="branchName"
            defaultValue={account?.branchName || ''}
            required={false}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isEditing ? 'Update Account' : 'Create Account'}
          </button>
        </div>
      </div>
    </Form>
  );
}
