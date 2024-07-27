import React, { useState } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server.v2";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "~/utils/budgets.server";
import { useNotification } from "~/components/ErrorNotification";
import { useFormState } from "~/hooks/useFormState";
import { PlusCircle, Edit2, Trash2 } from "lucide-react";
import { BUDGET_CATEGORIES } from "~/constants/categories";

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const budgets = await getBudgets(userId);
  return json({ budgets });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const action = formData.get("_action");

  console.log("action", action);
  switch (action) {
    case "create": {
      const newBudget = {
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        category: formData.get("category"),
        period: "monthly",
      };
      // @ts-ignore
      await createBudget(userId, newBudget);
      break;
    }
    case "update": {
      const budgetId = formData.get("id");
      const updatedBudget = {
        id: formData.get("id"),
        name: formData.get("name"),
        amount: parseFloat(formData.get("amount")),
        category: formData.get("category"),
      };
      await updateBudget(userId, budgetId, updatedBudget);
      break;
    }
    case "delete":
      await deleteBudget(userId, formData.get("id"));
      break;
    default:
      throw new Error("Invalid action");
  }

  return redirect("/budgets");
};

const BudgetForm = ({ budget, onSubmit, onCancel }) => {
  const { values, handleChange, handleSubmit, errors } = useFormState(
    budget || { name: "", amount: "", category: "" },
    {
      name: { required: "Budget name is required" },
      amount: {
        required: "Amount is required",
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount" },
      },
      category: { required: "Category is required" },
    }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} method="POST" className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Budget Name
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
          {BUDGET_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {budget ? "Update" : "Create"} Budget
        </button>
      </div>
    </form>
  );
};

export default function BudgetManagementPage() {
  const { budgets } = useLoaderData();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [editingBudget, setEditingBudget] = useState(null);

  const handleCreateSubmit = (formData) => {
    fetcher.submit({ ...formData, _action: "create" }, { method: "post" });
    addNotification("Budget created successfully", "success");
  };

  const handleUpdateSubmit = (formData) => {
    fetcher.submit(
      { ...formData, id: editingBudget.id, _action: "update" },
      { method: "post" }
    );
    setEditingBudget(null);
    addNotification("Budget updated successfully", "success");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      fetcher.submit({ id, _action: "delete" }, { method: "post" });
      addNotification("Budget deleted successfully", "success");
    }
  };

  const handleCancel = () => {
    setEditingBudget(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Budget Management</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Budget</h2>
        <BudgetForm
          budget={editingBudget}
          onSubmit={handleCreateSubmit}
          onCancel={handleCancel}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Budgets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <div key={budget.id} className="bg-white shadow rounded-lg p-6">
              {editingBudget?.id === budget.id ? (
                <BudgetForm
                  budget={budget}
                  onSubmit={handleUpdateSubmit}
                  onCancel={() => setEditingBudget(null)}
                />
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">{budget.name}</h3>
                  <p className="text-gray-600 mb-1">
                    Category: {budget.category}
                  </p>
                  <p className="text-2xl font-bold mb-4">
                    ${budget.amount.toFixed(2)}
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
