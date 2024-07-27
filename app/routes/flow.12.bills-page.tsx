import React, { useState } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server.v2";
import {
  getBills,
  createBill,
  updateBill,
  deleteBill,
} from "~/utils/bills.server";
import BillList from "~/components/BillList";
import SideDrawer from "~/components/SideDrawer";
import AddBillForm from "~/components/AddBillForm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const sortBy = url.searchParams.get("sortBy") || "dueDate";
  const sortOrder = url.searchParams.get("sortOrder") || "asc";
  const status = url.searchParams.get("status") || "all";

  const bills = await getBills(userId, {
    page,
    limit,
    sortBy,
    sortOrder,
    status,
  });

  return json({ bills });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  switch (_action) {
    case "create": {
      // const bill = Object.fromEntries(formData);
      const newBill = {
        ...values,
        name: values.name as string,
        dueDate: new Date(values.dueDate as string),
        amount: parseFloat(values.amount as string),
        category: values.category as string,
        recurring: values.recurring === "on" ? true : false,
      };

      await createBill(userId, newBill);
      return json({ success: true });
    }
    case "update": {
      const editedBill = {
        ...values,
        id: values.id as string,
        name: values.name as string,
        dueDate: new Date(values.dueDate as string),
        amount: parseFloat(values.amount as string),
        category: values.category as string,
        recurring: values.recurring === "on" ? true : false,
      };

      await updateBill(userId, editedBill.id, editedBill);
      return json({ success: true });
    }
    case "delete": {
      await deleteBill(userId, values.id as string);
      return json({ success: true });
    }
    default:
      return json({ error: "Invalid action" }, { status: 400 });
  }
};

export default function BillsPage() {
  const { bills } = useLoaderData<typeof loader>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const fetcher = useFetcher();

  const handleAddBill = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bills</h1>
        <button
          onClick={handleAddBill}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Bill
        </button>
      </div>
      <BillList bills={bills.bills} />
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Add Bill"
      >
        <AddBillForm onClose={handleCloseDrawer} />
      </SideDrawer>
    </div>
  );
}
