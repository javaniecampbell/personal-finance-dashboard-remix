import React from "react";
import { BILL_CATEGORIES } from "~/constants/categories";
import { useFormState } from "~/hooks/useFormState";
import { formatDate } from "~/utils/formatters";

const EditBillForm = ({ bill, onSubmit, onClose }) => {
  const { values, handleChange, handleSubmit, errors } = useFormState(
    {
      id: bill.id,
      name: bill.name,
      amount: bill.amount.toString(),
      dueDate: formatDate(bill.dueDate, "YYYY-MM-DD"),
      category: bill.category,
      recurring: bill.recurring,
      frequency: bill.frequency || "monthly",
    },
    {
      name: { required: "Bill name is required" },
      amount: {
        required: "Amount is required",
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount" },
      },
      dueDate: { required: "Due date is required" },
      category: { required: "Category is required" },
    }
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, (formData) => {
      onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <input type="hidden" name="id" value={values.id} />

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Bill Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={values.dueDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        /> */}
        <select
          name="category"
          id="category"
          onChange={handleChange}
          value={values.category}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {BILL_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="recurring"
          name="recurring"
          checked={values.recurring}
          onChange={handleChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="recurring" className="ml-2 block text-sm text-gray-900">
          Recurring
        </label>
      </div>

      {values.recurring && (
        <div>
          <label
            htmlFor="frequency"
            className="block text-sm font-medium text-gray-700"
          >
            Frequency
          </label>
          <select
            id="frequency"
            name="frequency"
            value={values.frequency}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Update Bill
        </button>
      </div>
    </form>
  );
};

export default EditBillForm;
