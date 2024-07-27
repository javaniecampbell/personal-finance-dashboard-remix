import React, { useState } from 'react';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { json } from '@remix-run/node';
import { requireUserId } from '~/utils/auth.server';
import { getBills, createBill } from '~/utils/bills.server';
import BillList from '~/components/BillList';
import SideDrawer from '~/components/SideDrawer';
import AddBillForm from '~/components/AddBillForm';

export const loader = async ({ request }) => {
  const userId = await requireUserId(request);
  const bills = await getBills(userId);
  return json({ bills });
};

export const action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const bill = Object.fromEntries(formData);
  await createBill(userId, bill);
  return json({ success: true });
};

export default function BillsPage() {
  const { bills } = useLoaderData();
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
      <BillList bills={bills} />
      <SideDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Add Bill">
        <AddBillForm onClose={handleCloseDrawer} />
      </SideDrawer>
    </div>
  );
}
