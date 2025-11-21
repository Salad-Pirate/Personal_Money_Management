import { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function Dashboard({ transactions }) {
  //  เพิ่ม state เลือกเดือน
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const currentMonth = selectedMonth;

  const legendMap = {
    income: "รายรับ",
    expense: "รายจ่าย",
    // balance: "ยอดคงเหลือ"
  };

  const monthlyData = useMemo(() => {
    const currentMonthTransactions = transactions.filter(
      (t) => t.occuredAt.startsWith(currentMonth)
    );

    const totalIncome = currentMonthTransactions
      .filter((t) => t.categoryType === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((t) => t.categoryType === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance, transactionCount: currentMonthTransactions.length };
  }, [transactions, currentMonth]);

  const recentTransactions = useMemo(() =>
    transactions
      .sort((a, b) => new Date(b.occuredAt).getTime() - new Date(a.occuredAt).getTime())
      .slice(0, 5),
    [transactions]
  );

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // สร้างข้อมูลกราฟรายวัน - จัดกลุ่มรายการตามวันที่
  const dailyChartData = useMemo(() => {
    const dailyStats = {};

    // ✅ กรองเฉพาะเดือนที่เลือก
    const filteredTransactions = transactions.filter((t) => t.occuredAt.startsWith(currentMonth));

    filteredTransactions.forEach(transaction => {
      const date = transaction.occuredAt.split('T')[0]; // แยกเอาเฉพาะวันที่

      if (!dailyStats[date]) {
        dailyStats[date] = {
          date: date,
          income: 0,
          expense: 0,
          balance: 0
        };
      }

      if (transaction.categoryType === 'Income') {
        dailyStats[date].income += transaction.amount;
      } else {
        dailyStats[date].expense += transaction.amount;
      }

      // คำนวณยอดคงเหลือของแต่ละวัน
      dailyStats[date].balance = dailyStats[date].income - dailyStats[date].expense;
    });

    // แปลงเป็น array และเรียงตามวันที่
    return Object.values(dailyStats)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, currentMonth]);

  const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };

  //  สร้างรายการเดือนย้อนหลัง 12 เดือน
  const availableMonths = useMemo(() => {
    const months = [];
    const now = new Date();

    // สร้างเดือนย้อนหลัง 12 เดือนรวมเดือนปัจจุบัน
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
    }

    // กลับลำดับจากมกราคม → เดือนปัจจุบัน
    return months;
  }, []);


  return (
    <>
      {/* Main Container: Reduced padding on mobile (px-4), larger on desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Section: Stacked on mobile, Row on desktop */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Welcome back! Here's your financial overview.</p>
          </div>

          {/* Date Select: Full width on mobile */}
          <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-bold text-gray-700">Select Date:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2.5 sm:py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + '-01').toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          {/* Income Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(monthlyData.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {formatCurrency(monthlyData.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${monthlyData.balance >= 0 ? 'bg-emerald-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <DollarSign className={`w-5 h-5 sm:w-6 sm:h-6 ${monthlyData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-lg sm:text-2xl font-bold truncate ${monthlyData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyData.balance)}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Count Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">This Month</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{monthlyData.transactionCount}</p>
                  <p className="text-xs text-gray-500">Trans.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section: Stacked on mobile, 2 cols on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Income & Expense Trend</h3>
              <p className="text-xs sm:text-sm text-gray-600">รายรับ-รายจ่ายรายวันของเดือนที่เลือก</p>
            </div>
            {/* Height adjusted for mobile vs desktop */}
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="#6b7280"
                    fontSize={10}
                    tickMargin={10}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    stroke="#6b7280"
                    fontSize={10}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), legendMap[name] || name]}
                    labelFormatter={(label) => `วันที่: ${formatChartDate(label)}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => <span className="text-xs sm:text-sm">{value === 'income' ? 'รายรับ' : value === 'expense' ? 'รายจ่าย' : 'ยอดคงเหลือ'}</span>}
                  />
                  <Bar dataKey="income" fill="#10b981" name="รายรับ" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="#ef4444" name="รายจ่าย" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Daily Trend Analysis</h3>
              <p className="text-xs sm:text-sm text-gray-600">แนวโน้มการใช้จ่ายตลอดเดือน</p>
            </div>
            <div className="h-64 sm:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="#6b7280"
                    fontSize={10}
                    tickMargin={10}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    stroke="#6b7280"
                    fontSize={10}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), legendMap[name] || name]}
                    labelFormatter={(label) => `วันที่: ${formatChartDate(label)}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '10px' }}
                    formatter={(value) => <span className="text-xs sm:text-sm">{value === 'income' ? 'รายรับ' : value === 'expense' ? 'รายจ่าย' : 'ยอดคงเหลือ'}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    name="รายรับ"
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    activeDot={{ r: 4 }}
                    name="รายจ่าย"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 bg-gray-50 sm:bg-white">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransactions.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm sm:text-base text-gray-500">No transactions yet. Start by adding your first transaction!</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.transactionId} className="px-4 py-3 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Left Side: Icon + Text */}
                    <div className="flex items-center flex-1 min-w-0 mr-2">
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${transaction.categoryType === 'Income' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                        {transaction.categoryType === 'Income' ? (
                          <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 text-emerald-600`} />
                        ) : (
                          <TrendingDown className={`w-4 h-4 sm:w-5 sm:h-5 text-red-600`} />
                        )}
                      </div>
                      <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{transaction.categoryName}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.occuredAt)}</p>
                        {transaction.note && (
                          <p className="text-xs text-gray-400 truncate">{transaction.note}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Side: Amount */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm sm:text-lg font-semibold ${transaction.categoryType === 'Income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                        {transaction.categoryType === 'Income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 max-w-[80px] sm:max-w-none truncate ml-auto">{transaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}