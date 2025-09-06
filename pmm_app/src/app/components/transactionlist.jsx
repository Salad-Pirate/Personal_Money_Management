import { useState, useMemo } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';

export function TransactionsList({ transactions, categories, paymentMethods }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch = transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.location?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesCategory = !filterCategory || transaction.category === filterCategory;
        
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, filterType, filterCategory]);

  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.color || '#6B7280';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-gray-600 mt-2">View and manage all your financial transactions.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="lg:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterCategory
                ? 'Try adjusting your filters or search terms.'
                : 'Start by adding your first transaction!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getCategoryColor(transaction.category) + '20' }}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-6 h-6" style={{ color: getCategoryColor(transaction.category) }} />
                      ) : (
                        <TrendingDown className="w-6 h-6" style={{ color: getCategoryColor(transaction.category) }} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">{transaction.category}</h3>
                        <span 
                          className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: getCategoryColor(transaction.category) + '20',
                            color: getCategoryColor(transaction.category)
                          }}
                        >
                          {transaction.type}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(transaction.date)}
                        <span className="mx-2">•</span>
                        {transaction.paymentMethod}
                        {transaction.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="w-4 h-4 mr-1" />
                            {transaction.location}
                          </>
                        )}
                      </div>
                      {transaction.note && (
                        <p className="text-sm text-gray-600 mt-1">{transaction.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}