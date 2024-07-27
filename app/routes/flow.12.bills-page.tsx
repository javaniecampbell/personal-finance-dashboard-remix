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
import EditBillForm from "~/components/EditBillForm";
import { Bill } from "~/types";
import { useNotification } from "~/components/ErrorNotification";

// type Bill = {
//   id: string;
//   name: string;
//   amount: number;
//   dueDate: string;
//   category: string;
//   status: 'paid' | 'unpaid';
//   recurring: boolean;
//   frequency?: 'weekly' | 'monthly' | 'yearly';
// };
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

export default async function BillsPage() {
  const { bills } = await useLoaderData<typeof loader>();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const { addNotification } = useNotification();
  const fetcher = useFetcher();
  const billList = bills.bills.map((bill) => {
    return {
      id: bill.id,
      name: bill.name,
      amount: bill.amount,
      dueDate: new Date(bill.dueDate),
      category: bill.category,
      status: bill.status,
      recurring: bill.recurring,
      frequency: bill.frequency,
    } as Bill;
  });

  const openAddBill = () => {
    setEditingBill(null);
    setIsDrawerOpen(true);
  };

  const handleAddBill = (bill: Bill) => {
    setEditingBill(null);
    try {
      fetcher.submit({ ...bill, _action: "create" }, { method: "post" });

      const result = fetcher.data;
      if (result?.success) {
        addNotification("Bill added successfully", "success");
        setIsDrawerOpen(false);
      } else {
        addNotification("Failed to add bill", "warning");
        setIsDrawerOpen(true);
      }
    } catch (error) {
      console.error("Failed to add bill:", error);
      addNotification("Failed to add bill", "error");
      setIsDrawerOpen(false);
    }
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setIsDrawerOpen(true);
  };

  const handleUpdateBill = async (updatedBill: Bill) => {
    try {
      await fetcher.submit(
        { ...updatedBill, _action: "update" },
        { method: "post" }
      );
      setEditingBill(null);
    } catch (error) {
      console.error("Failed to update bill:", error);
    }
  };

  const handleDeleteBill = (billId: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      fetcher.submit({ _action: "delete", id: billId }, { method: "post" });
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBill(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bills</h1>
        <button
          onClick={openAddBill}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Bill
        </button>
      </div>
      <BillList
        bills={billList}
        onEditBill={handleEditBill}
        onDeleteBill={handleDeleteBill}
      />
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Add Bill"
      >
        <SideDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          title={editingBill ? "Edit Bill" : "Add Bill"}
        >
          {editingBill ? (
            <EditBillForm
              bill={editingBill}
              onSubmit={handleUpdateBill}
              onClose={handleCloseDrawer}
            />
          ) : (
            <AddBillForm onSubmit={handleAddBill} onClose={handleCloseDrawer} />
          )}
        </SideDrawer>
      </SideDrawer>
    </div>
  );
}
