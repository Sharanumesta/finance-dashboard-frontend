import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboard.service';
import SummaryCards from '../components/Dashboard/SummaryCards';
import CategoryChart from '../components/Dashboard/CategoryChart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import TrendsChart from '../components/Dashboard/TrendsChart';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, categoriesRes, monthlyRes, recentRes] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getCategoryBreakdown(),
        dashboardService.getMonthlyTrends(),
        dashboardService.getRecentActivity(10)
      ]);
      setSummary(summaryRes.data);
      setCategoryData(categoriesRes.data);
      setMonthlyData(monthlyRes.data);
      setRecentTransactions(recentRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
      </div>

      <SummaryCards summary={summary} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <CategoryChart data={categoryData} />
        <TrendsChart data={monthlyData} />
      </div>
      
      <div className="mt-6">
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;