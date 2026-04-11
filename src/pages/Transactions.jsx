import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/transaction.service';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Transactions = () => {
  const { hasRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 10, // Changed to 10
    sortBy: searchParams.get('sortBy') || 'date',
    sortOrder: searchParams.get('sortOrder') || 'desc'
  });

  const canEdit = hasRole('ADMIN');
  const canView = hasRole(['ADMIN', 'ANALYST']);

  // Listen for limit change event
  useEffect(() => {
    const handleLimitChange = (event) => {
      const newLimit = event.detail;
      setFilters(prev => ({
        ...prev,
        limit: newLimit,
        page: 1 // Reset to first page when changing rows per page
      }));
    };

    window.addEventListener('pageLimitChange', handleLimitChange);
    return () => window.removeEventListener('pageLimitChange', handleLimitChange);
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.type) params.set('type', filters.type);
    if (filters.category) params.set('category', filters.category);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.page && filters.page !== 1) params.set('page', filters.page);
    if (filters.limit && filters.limit !== 10) params.set('limit', filters.limit);
    if (filters.sortBy && filters.sortBy !== 'date') params.set('sortBy', filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== 'desc') params.set('sortOrder', filters.sortOrder);
    
    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Fetch transactions when filters change
  useEffect(() => {
    if (canView) {
      fetchTransactions();
    }
  }, [filters, canView]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactions(filters);
      
      // Handle different response structures
      let transactionsData = [];
      let paginationData = { page: filters.page, limit: filters.limit, total: 0, pages: 1 };
      
      if (response.data) {
        if (response.data) {
          transactionsData = response.data;
          paginationData = response.meta;
        } else if (Array.isArray(response.data)) {
          transactionsData = response.data;
        } else {
          transactionsData = response.data || [];
        }
      } else if (Array.isArray(response)) {
        transactionsData = response.data;
      } else {
        transactionsData = response.data || [];
        paginationData = response.meta || paginationData;
      }
      
      setTransactions(transactionsData);
      setPagination({
        total: paginationData.total,
        page: paginationData.page || filters.page,
        limit: paginationData.limit || filters.limit,
        pages: paginationData.totalPages || Math.ceil((paginationData.total || transactionsData.length) / (paginationData.limit || filters.limit))
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    // Reset to page 1 when filters change
    setFilters({ 
      ...filters, 
      ...newFilters, 
      page: 1 
    });
  };

  const handlePageChange = (newPage) => {
    console.log('Changing to page:', newPage);
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditTransaction = async (transaction) => {
    console.log('Editing transaction:', transaction);
    setLoadingTransaction(true);
    setShowForm(true);
    
    try {
      // Fetch fresh transaction details from backend
      const response = await transactionService.getTransactionById(transaction.id);
      console.log('Fetched transaction details:', response);
      
      let transactionData = response.data || response;
      if (transactionData.data) transactionData = transactionData.data;
      
      setEditingTransaction(transactionData);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      toast.error('Failed to load transaction details');
      // Fallback to the transaction from the list
      setEditingTransaction(transaction);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const handleCreateTransaction = async (data) => {
    try {
      await transactionService.createTransaction(data);
      toast.success('Transaction created successfully');
      fetchTransactions();
      setShowForm(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to create transaction');
    }
  };

  const handleUpdateTransaction = async (id, data) => {
    try {
      await transactionService.updateTransaction(id, data);
      toast.success('Transaction updated successfully');
      fetchTransactions();
      setEditingTransaction(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(error.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        toast.success('Transaction deleted successfully');
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.error(error.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTransaction(null);
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

      <TransactionFilters 
        filters={filters} 
        setFilters={handleFilterChange} 
      />
      
      {/* Active filters display */}
      {(filters.type || filters.category || filters.startDate || filters.endDate) && (
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.type && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              Type: {filters.type}
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              Category: {filters.category}
            </span>
          )}
          {filters.startDate && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              From: {filters.startDate}
            </span>
          )}
          {filters.endDate && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              To: {filters.endDate}
            </span>
          )}
          <button
            onClick={() => handleFilterChange({ type: '', category: '', startDate: '', endDate: '' })}
            className="text-xs text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        </div>
      )}
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <TransactionList
          transactions={transactions}
          canEdit={canEdit}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={editingTransaction ? handleUpdateTransaction : handleCreateTransaction}
          onClose={handleCloseForm}
          loading={loadingTransaction}
        />
      )}
    </div>
  );
};

export default Transactions;