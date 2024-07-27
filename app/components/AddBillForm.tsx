import React from 'react';
import { Form, useActionData } from '@remix-run/react';
import { useFormState } from '~/hooks/useFormState';

const AddBillForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const actionData = useActionData();
  const { values, handleChange, handleSubmit, errors } = useFormState({
    name: '',
    amount: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: '',
    recurring: false,
    frequency: 'monthly',
  });

  return (
    <Form method="post" onSubmit={(e) => handleSubmit(e, onClose)}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Bill Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.amount && <p className="mt-2 text-sm text-red-600">{errors.amount}</p>}
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.dueDate && <p className="mt-2 text-sm text-red-600">{errors.dueDate}</p>}
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={values.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category}</p>}
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="recurring"
              name="recurring"
              type="checkbox"
              checked={values.recurring}
              onChange={handleChange}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="recurring" className="font-medium text-gray-700">Recurring</label>
          </div>
        </div>
        {values.recurring && (
          <div>
            <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              id="frequency"
              name="frequency"
              value={values.frequency}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            {errors.frequency && <p className="mt-2 text-sm text-red-600">{errors.frequency}</p>}
          </div>
        )}
      </div>
      <div className="mt-5 sm:mt-6">
        <button
          type="submit"
          className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
        >
          Add Bill
        </button>
      </div>
    </Form>
  );
};

export default AddBillForm;