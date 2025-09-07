import { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function Dashboard({ transactions }) {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const legendMap = {
    income: "รายรับ",
    expense: "รายจ่าย",
    // balance: "ยอดคงเหลือ"
  };

  const monthlyData = useMemo(() => {
    const currentMonthTransactions = transactions.filter(
      (t) => t.date.startsWith(currentMonth)
    );

    const totalIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance, transactionCount: currentMonthTransactions.length };
  }, [transactions, currentMonth]);

  const recentTransactions = useMemo(() =>
    transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

    transactions.forEach(transaction => {
      const date = transaction.date.split('T')[0]; // แยกเอาเฉพาะวันที่

      if (!dailyStats[date]) {
        dailyStats[date] = {
          date: date,
          income: 0,
          expense: 0,
          balance: 0
        };
      }

      if (transaction.type === 'income') {
        dailyStats[date].income += transaction.amount;
      } else {
        dailyStats[date].expense += transaction.amount;
      }

      // คำนวณยอดคงเหลือของแต่ละวัน
      dailyStats[date].balance = dailyStats[date].income - dailyStats[date].expense;
    });

    // แปลงเป็น array และเรียงตามวันที่
    return Object.values(dailyStats)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-30); // เอาเฉพาะ 30 วันล่าสุด
  }, [transactions]);

  const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyData.totalIncome)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(monthlyData.totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${monthlyData.balance >= 0 ? 'bg-emerald-100' : 'bg-red-100'} rounded-lg flex items-center justify-center`}>
                  <DollarSign className={`w-5 h-5 ${monthlyData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className={`text-2xl font-bold ${monthlyData.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyData.balance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{monthlyData.transactionCount}</p>
                <p className="text-sm text-gray-500">Transactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section - ส่วนของกราฟแสดงผล */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* Daily Income/Expense Trend Chart - กราฟแท่งรายรับรายจ่ายรายวัน */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Income & Expense Trend</h3>
              <p className="text-sm text-gray-600">รายรับ-รายจ่ายรายวันย้อนหลัง 30 วัน</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), legendMap[name] || name]}
                    labelFormatter={(label) => `วันที่: ${formatChartDate(label)}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend
                    formatter={(value) => value === 'income' ? 'รายรับ' : value === 'expense' ? 'รายจ่าย' : 'ยอดคงเหลือ'}
                  />

                  {/* Bar for Income */}
                  <Bar dataKey="income" fill="#10b981" name="รายรับ" radius={[6, 6, 0, 0]} />

                  {/* Bar for Expense */}
                  <Bar dataKey="expense" fill="#ef4444" name="รายจ่าย" radius={[6, 6, 0, 0]} />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Income/Expense Trend Chart - กราฟเส้นรายรับรายจ่ายรายวัน */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Daily Income & Expense Trend</h3>
              <p className="text-sm text-gray-600">รายรับ-รายจ่ายรายวันย้อนหลัง 30 วัน</p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value, name) => [formatCurrency(value), legendMap[name] || name]}
                    labelFormatter={(label) => `วันที่: ${formatChartDate(label)}`}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Legend
                    formatter={(value) => value === 'income' ? 'รายรับ' : value === 'expense' ? 'รายจ่าย' : 'ยอดคงเหลือ'}
                  />

                  {/* Line for Income */}
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="รายรับ"
                  />

                  {/* Line for Expense */}
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                    name="รายจ่าย"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>



        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransactions.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">No transactions yet. Start by adding your first transaction!</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-emerald-100' : 'bg-red-100'
                        }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className={`w-5 h-5 text-emerald-600`} />
                        ) : (
                          <TrendingDown className={`w-5 h-5 text-red-600`} />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">{transaction.category}</p>
                        <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
                        {transaction.note && (
                          <p className="text-sm text-gray-400 truncate max-w-xs">{transaction.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.paymentMethod}</p>
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