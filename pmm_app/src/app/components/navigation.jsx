import { Home, Plus, List, Settings, DollarSign, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Navigation({ currentPage, onPageChange, user }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-transaction', label: 'Add', icon: Plus },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Top Navigation Bar - Fixed on all devices */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            
            {/* Left Section: Logo & Desktop Nav */}
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0">
                <DollarSign className="w-8 h-8 text-emerald-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">MoneyTracker</span>
              </div>

              {/* Desktop Navigation Links (Hidden on Mobile) */}
              <div className="hidden md:flex ml-10 items-baseline space-x-4">
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

            {/* Right Section: Actions & User Info */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Suggest Location - Accessible on Mobile & Desktop now */}
              <Link
                href='/suggest-location'
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Suggest Location"
              >
                <MapPin className="w-5 h-5" />
              </Link>

              {/* User Greeting - Responsive Text */}
              <div className="flex items-center">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Welcome, {user.name}!
                </span>
                {/* Shortened name for mobile to save space */}
                <span className="text-sm text-gray-700 block sm:hidden font-medium truncate max-w-[100px]">
                  {user.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Hidden on Desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-pb">
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
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}