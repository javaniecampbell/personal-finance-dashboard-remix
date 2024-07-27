import React from "react";
import { Form, useActionData } from "@remix-run/react";
import { useFormState } from "~/hooks/useFormState";
import { Transaction } from "~/types";
import { TRANSACTION_CATEGORIES } from "~/constants/categories";

const AddTransactionForm: React.FC<{
  onSubmit: (transactionData: Transaction) => void;
  onClose: () => void;
}> = ({ onSubmit, onClose }) => {
  const actionData = useActionData();
  const { values, handleChange, handleSubmit, errors } = useFormState(
    {
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      type: "expense",
    },
    {
      description: { required: "Description is required" },
      amount: {
        required: "Amount is required",
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount" },
      },
      category: { required: "Category is required" },
      date: { required: "Date is required" },
    }
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(onSubmit)(e);
    onClose();
  };

  return (
    <Form method="post" onSubmit={handleFormSubmit}>
      <div className="space-y-4">
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
            value={values.description}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600">{errors.description}</p>
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
            onChange={handleChange}
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          {/* <input
            type="text"
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          /> */}
          <select
            name="category"
            id="category"
            onChange={handleChange}
            value={values.category}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {TRANSACTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-2 text-sm text-red-600">{errors.category}</p>
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
            value={values.date}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.date && (
            <p className="mt-2 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
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
            value={values.type}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && (
            <p className="mt-2 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          Add Transaction
        </button>
      </div>
    </Form>
  );
};

export default AddTransactionForm;
