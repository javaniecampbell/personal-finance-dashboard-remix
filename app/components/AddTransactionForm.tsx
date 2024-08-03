import React, { FormEvent, useState } from "react";
import { Form, useNavigation } from "@remix-run/react";
import { useFormState } from "~/hooks/useFormState";
import { Account } from "~/types";
import { TRANSACTION_CATEGORIES } from "~/constants/categories";

type CreateTransaction = {
  description: string;
  amount: string;
  category: string;
  date: string;
  type: string;
  accountId?: string;
  toAccountId?: string;
};

const AddTransactionForm: React.FC<{
  accounts?: Account[];
  onSubmit: (transactionData: CreateTransaction) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose, accounts }) => {
  const transition = useNavigation();
  const [isTransfer, setIsTransfer] = useState(false);
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    isValid,
    resetForm,
    handleBlur,
    touched,
  } = useFormState<CreateTransaction>(
    {
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
      accountId: "",
      toAccountId: "",
    },
    {
      type: {
        required: { value: true, message: "Type is required" },
      },
      description: {
        required: { value: true, message: "Description is required" },
      },
      amount: {
        required: { value: true, message: "Amount is required" },
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount" },
      },
      category: {
        required: { value: true, message: "Category is required" },
        when: (values) => values.type !== "transfer",
      },
      date: {
        required: { value: true, message: "Date is required" },
      },
      accountId: {
        required: { value: true, message: "Account is required" },
      },
      toAccountId: {
        required: { value: true, message: "To Account is required" },
        when: (values) => values.type === "transfer",
      },
    }
  );

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
    if (JSON.stringify(errors) === "{}") {
      resetForm();
      onClose();
    }
  };

  return (
    <Form method="post" onSubmit={handleFormSubmit}>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            required
            value={values.type}
            onBlur={handleBlur}
            onChange={(e) => {
              setIsTransfer(e.target.value === "transfer");
              handleChange(e);
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a transaction type</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>
          {touched.type && errors.type && (
            <p className="mt-2 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={values.amount}
            onBlur={handleBlur}
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {touched.amount && errors.amount && (
            <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            required
            value={values.description}
            onBlur={handleBlur}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {touched.description && errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            required
            value={values.date}
            onBlur={handleBlur}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {touched.date && errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="accountId"
            className="block text-sm font-medium text-gray-700"
          >
            {isTransfer ? "From Account" : "Account"}
          </label>
          <select
            id="accountId"
            name="accountId"
            required
            value={values.accountId}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indig
            onBlur={handleBlur}o-500 sm:text-sm rounded-md"
            onChange={(e) => {
              e.preventDefault();
              setIsTransfer(e.target.value === "transfer");
              handleChange(e);
            }}
          >
            <option value="">Select an account</option>
            {accounts?.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
          {touched.accountId && errors.accountId && (
            <p className="mt-2 text-sm text-red-600">{errors.accountId}</p>
          )}
        </div>

        {isTransfer && (
          <div>
            <label
              htmlFor="toAccountId"
              className="block text-sm font-medium text-gray-700"
            >
              To Account
            </label>
            <select
              id="toAccountId"
              name="toAccountId"
              required
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.toAccountId}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select an account</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
            {touched.toAccountId && errors.toAccountId && (
              <p className="mt-2 text-sm text-red-600">{errors.toAccountId}</p>
            )}
          </div>
        )}
        {!isTransfer && (
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            {/* <input
              type="text"
              name="category"
              id="category"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            /> */}
            <select
              name="category"
              id="category"
              required
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.category}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a category</option>
              {TRANSACTION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {touched.category && errors.category && (
              <p className="mt-2 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          disabled={!isValid || transition.state === "submitting"}
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          {transition.state === "submitting"
            ? "Submitting..."
            : "Create Transaction"}
        </button>
      </div>
    </Form>
  );
};

export default AddTransactionForm;
