import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Default color palette
const DEFAULT_COLORS = [
  "#10B981", "#EF4444", "#3B82F6", "#F59E0B", "#8B5CF6",
  "#EC4899", "#06B6D4", "#F97316", "#6366F1", "#14B8A6",
];

const CategoryBreakdown = ({ 
  categoryData, 
  formatCurrency,
  title = "Category Breakdown",
  showPieChart = true,
  showTable = true,
  height = 400,
  colors = DEFAULT_COLORS,
  className = ""
}) => {
  // Prepare data for pie chart
  const getPieChartData = () => {
    if (!categoryData || categoryData.length === 0) return [];
    
    return categoryData.map((category) => {
      const totalAmount =
        Math.abs(category.income || 0) + Math.abs(category.expense || 0);
      return {
        name: category.category,
        value: totalAmount,
        income: category.income || 0,
        expense: category.expense || 0,
      };
    });
  };

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pieData = getPieChartData();
      const overallTotal = pieData.reduce((sum, item) => sum + item.value, 0);
      const percentage = overallTotal > 0 ? (data.value / overallTotal) * 100 : 0;
      
      return (
        <div className="bg-white p-3 shadow-lg rounded border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: {formatCurrency(data.value)}
          </p>
          {data.income > 0 && (
            <p className="text-sm text-green-600">
              Income: {formatCurrency(data.income)}
            </p>
          )}
          {data.expense > 0 && (
            <p className="text-sm text-red-600">
              Expense: {formatCurrency(data.expense)}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            {percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  const pieData = getPieChartData();
  const overallTotal = pieData.reduce((sum, item) => sum + item.value, 0);

  if (!categoryData || categoryData.length === 0) {
    return (
      <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 text-center py-8">No category data available</p>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 rounded-lg shadow ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>

      {/* Pie Chart Section */}
      {showPieChart && (
        <div className="mb-8">
          <div style={{ height: `${height}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => 
                    showTable ? `${name}: ${(percent * 100).toFixed(1)}%` : name
                  }
                  outerRadius={Math.min(120, height / 3)}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Total Transaction Volume: {formatCurrency(overallTotal)}
            </p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categoryData.map((category, index) => {
                const totalAmount =
                  Math.abs(category.income || 0) + Math.abs(category.expense || 0);
                const percentage =
                  overallTotal > 0 ? (totalAmount / overallTotal) * 100 : 0;

                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        {showPieChart && (
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: colors[index % colors.length] }}
                          />
                        )}
                        {category.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {formatCurrency(totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;