import { Home, Plus, List, Settings, DollarSign } from 'lucide-react';

export function Navigation({ currentPage, onPageChange, user }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-transaction', label: 'Add', icon: Plus },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MoneyTracker</span>
              </div>
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onPageChange(item.id)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        currentPage === item.id
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 inline-block mr-2" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700">Welcome, {user.name}!</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  currentPage === item.id
                    ? 'text-emerald-600'
                    : 'text-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}