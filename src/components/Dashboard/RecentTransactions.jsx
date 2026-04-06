import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const RecentTransactions = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeColor = (type) => {
    return type === "income" ? "text-green-600" : "text-red-600";
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Transactions
          </h3>
          <Link
            to="/transactions"
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            View all <ArrowRightIcon className="h-4 w-4 inline" />
          </Link>
        </div>
        <div className="text-center text-gray-500 py-8">
          No recent transactions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          View all <ArrowRightIcon className="h-4 w-4 inline" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.description || transaction.notes || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${getTypeColor(transaction.type)}`}
                >
                  {transaction.type === "expense" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
