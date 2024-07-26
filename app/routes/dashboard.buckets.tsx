import React, { useState } from "react";
import { useLoaderData, useFetcher, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import Layout from "~/components/Layout";

// Mock data - replace with actual data fetching in a real application
let mockBuckets = [
  { id: "1", name: "Groceries", budget: 500 },
  { id: "2", name: "Entertainment", budget: 200 },
  { id: "3", name: "Utilities", budget: 300 },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return json({ buckets: mockBuckets });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUserId(request);
  const formData = await request.formData();
  const action = formData.get("_action");

  switch (action) {
    case "create":
    case "edit": {
      const name = formData.get("name");
      const budget = formData.get("budget");
      const id = formData.get("id") || Date.now().toString();

      if (typeof name !== "string" || typeof budget !== "string") {
        return json({ error: "Invalid form data" }, { status: 400 });
      }

      const newBucket = { id, name, budget: parseFloat(budget) };

      if (action === "create") {
        mockBuckets.push(newBucket);
      } else {
        mockBuckets = mockBuckets.map((b) => (b.id === id ? newBucket : b));
      }

      return json({ bucket: newBucket });
    }
    case "delete": {
      const id = formData.get("id");
      mockBuckets = mockBuckets.filter((b) => b.id !== id);
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};

export default function BucketManagement() {
  const { buckets } = useLoaderData();
  const [editingBucket, setEditingBucket] = useState(null);
  const fetcher = useFetcher();
  const transition = useNavigation();

  const isSubmitting = transition.state === "submitting";

  const handleEdit = (bucket) => {
    setEditingBucket(bucket);
  };

  const handleCancelEdit = () => {
    setEditingBucket(null);
  };

  const optimisticBuckets = React.useMemo(() => {
    if (isSubmitting) {
      const formData = new FormData(document.querySelector("form"));
      const action = formData.get("_action");
      const id = formData.get("id");
      const name = formData.get("name");
      const budget = formData.get("budget");

      if (action === "create") {
        return [...buckets, { id: "temp", name, budget: parseFloat(budget) }];
      } else if (action === "edit") {
        return buckets.map((b) =>
          b.id === id ? { ...b, name, budget: parseFloat(budget) } : b
        );
      } else if (action === "delete") {
        return buckets.filter((b) => b.id !== id);
      }
    }
    return buckets;
  }, [buckets, isSubmitting]);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Budget Buckets
      </h2>

      <fetcher.Form
        method="post"
        className="mb-8 p-4 bg-white rounded-lg shadow"
      >
        <input
          type="hidden"
          name="_action"
          value={editingBucket ? "edit" : "create"}
        />
        {editingBucket && (
          <input type="hidden" name="id" value={editingBucket.id} />
        )}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Bucket Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={editingBucket?.name || ""}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="budget"
            className="block text-sm font-medium text-gray-700"
          >
            Budget Amount
          </label>
          <input
            type="number"
            id="budget"
            name="budget"
            defaultValue={editingBucket?.budget || ""}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-2">
          {editingBucket && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingBucket ? "Update" : "Create"} Bucket
          </button>
        </div>
      </fetcher.Form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {optimisticBuckets.map((bucket) => (
          <div key={bucket.id} className="p-4 border-b last:border-b-0">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {bucket.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Budget: ${bucket.budget.toFixed(2)}
                </p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(bucket)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <fetcher.Form method="post" style={{ display: "inline" }}>
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="id" value={bucket.id} />
                  <button
                    type="submit"
                    className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </fetcher.Form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
