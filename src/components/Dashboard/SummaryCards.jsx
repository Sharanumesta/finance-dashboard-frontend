import React from 'react';
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  const cards = [
    {
      name: 'Total Income',
      value: summary.totalIncome || 0,
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Expenses',
      value: summary.totalExpenses || 0,
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      name: 'Net Balance',
      value: summary.netBalance || 0,
      icon: BanknotesIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Total Transactions',
      value: summary.totalTransactions || 0,
      icon: ScaleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.name}
          className="bg-white overflow-hidden shadow rounded-lg"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="shrink-0">
                <div className={`${card.bgColor} rounded-md p-3`}>
                  <card.icon className={`h-6 w-6 ${card.color}`} aria-hidden="true" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {formatCurrency(card.value)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;