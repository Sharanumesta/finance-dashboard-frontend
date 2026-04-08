import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transaction.service';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';

const Transactions = () => {
  const { hasRole } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  const canEdit = hasRole('ADMIN');
  const canView = hasRole(['ADMIN', 'ANALYST']);

  useEffect(() => {
    if (canView) {
      fetchTransactions();
    }
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactions(filters);
      setTransactions(response.transactions);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (data) => {
    try {
      await transactionService.createTransaction(data);
      fetchTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id, data) => {
    try {
      await transactionService.updateTransaction(id, data);
      fetchTransactions();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  if (!canView) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">You don't have permission to view transactions.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">Manage your financial transactions</p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Transaction
          </button>
        )}
      </div>

      <TransactionFilters filters={filters} setFilters={setFilters} />
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TransactionList
          transactions={transactions}
          canEdit={canEdit}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
          pagination={pagination}
          setFilters={setFilters}
        />
      )}

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;