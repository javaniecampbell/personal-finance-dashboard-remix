import React, { useState } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import {
  getUpcomingBills,
  getBillHistory,
  scheduleBillPayment,
} from "~/utils/bills.server";
import { useNotification } from "~/components/ErrorNotification";
import { useFormState } from "~/hooks/useFormState";
import { Calendar, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { formatDate, formatCurrency } from "~/utils/formatters";
import { Bill } from "~/types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const upcomingBills = await getUpcomingBills(userId);
  const billHistory = await getBillHistory(userId);
  return json({ upcomingBills, billHistory });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const billId = formData.get("billId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const paymentDate = formData.get("paymentDate") as string;

  await scheduleBillPayment(userId, billId, amount, new Date(paymentDate));

  return redirect("/bills");
};

const BillPaymentForm = ({
  bill,
  onSubmit,
}: {
  bill: Bill;
  onSubmit: (formData: Bill) => void;
}) => {
  const { values, handleChange, handleSubmit, errors } = useFormState(
    { amount: bill.amount, paymentDate: formatDate(new Date(), "YYYY-MM-DD") },
    {
      amount: {
        required: "Amount is required",
        pattern: { value: /^\d+(\.\d{1,2})?$/, message: "Invalid amount" },
      },
      paymentDate: { required: "Payment date is required" },
    }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" name="billId" value={bill.id} />
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
          htmlFor="paymentDate"
          className="block text-sm font-medium text-gray-700"
        >
          Payment Date
        </label>
        <input
          type="date"
          id="paymentDate"
          name="paymentDate"
          value={values.paymentDate}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        {errors.paymentDate && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Schedule Payment
        </button>
      </div>
    </form>
  );
};

export default function BillPaymentPage() {
  const { upcomingBills, billHistory } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const { addNotification } = useNotification();
  const [selectedBill, setSelectedBill] = useState(null);

  const handlePaymentSubmit = (formData) => {
    fetcher.submit(formData, { method: "post" });
    addNotification("Payment scheduled successfully", "success");
    setSelectedBill(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Bill Payment</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Bills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingBills.map((bill) => (
            <div key={bill.id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">{bill.name}</h3>
              <p className="text-gray-600 mb-1">
                Due: {formatDate(bill.dueDate)}
              </p>
              <p className="text-2xl font-bold mb-4">
                {formatCurrency(bill.amount)}
              </p>
              <button
                onClick={() => setSelectedBill(bill)}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedBill && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Pay {selectedBill.name}
              </h3>
              <div className="mt-2 px-7 py-3">
                <BillPaymentForm
                  bill={selectedBill}
                  onSubmit={handlePaymentSubmit}
                />
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {billHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.billName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(payment.datePaid)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.status === "completed" ? (
                      <span className="flex items-center text-green-600">
                        <CheckCircle size={16} className="mr-1" /> Completed
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <AlertCircle size={16} className="mr-1" /> Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
