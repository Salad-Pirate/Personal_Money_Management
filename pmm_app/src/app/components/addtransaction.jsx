import { useState } from 'react';
import { ArrowLeft, DollarSign, Calendar, MapPin, FileText, CreditCard, Tag, Wallet, Plus, X } from 'lucide-react';

export function AddTransaction({ categories, paymentMethods, onAddTransaction, onCancel }) {

  const [user_Wallet, setUserWallet] = useState(["wallet1", "wallet2", "wallet3"]);
  const [current_wallet, setCurrentWallet] = useState(user_Wallet[0] || '');
  const [showModal, setShowModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState('');

  const [transactionType, setTransactionType] = useState('expense');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    note: '',
    wallet: user_Wallet[0], // เพิ่ม wallet ใน formData
  });
  const [errors, setErrors] = useState({});

  const availableCategories = categories.filter(cat => cat.type === transactionType);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }

    if (!formData.wallet) {
      newErrors.wallet = 'Please select a wallet';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ฟังก์ชันสำหรับจัดการเลือก wallet
  const handleWalletSelect = (wallet) => {
    setCurrentWallet(wallet);
    setFormData({ ...formData, wallet: wallet });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      type: transactionType,
      amount: parseFloat(formData.amount),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      location: formData.location,
      note: formData.note,
      wallet: formData.wallet, // ส่งค่า wallet ไป backend
    };

    try {
      const res = await fetch("http://localhost:8080/transactions/post-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json?.() ?? await res.text();

      console.log("BE response:", data);
      alert("Sucessful");
    } catch (err) {
      console.error(err);
      alert("Unsuccessful");
    }
  };

  const Create_Wallet = () => {

  };
  // ฟังก์ชันกด Add wallet
  const handleAddWallet = () => {
    if (newWalletName.trim() !== '') {
      const updatedWallets = [...user_Wallet, newWalletName];
      setUserWallet(updatedWallets);
      setCurrentWallet(newWalletName);
      setFormData({ ...formData, wallet: newWalletName });
      setNewWalletName('');
      setShowModal(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Add Transaction</h1>
          </div>
        </div>

        <div className="p-6">
          {/* Transaction Type Toggle */}
          <div className="mb-6">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setTransactionType('expense');
                  setFormData({ ...formData, category: '' });
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${transactionType === 'expense'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransactionType('income');
                  setFormData({ ...formData, category: '' });
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${transactionType === 'income'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Income
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.amount ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0.00"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a category</option>
                  {availableCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.id} value={method.name}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
            </div>

            {/* Wallet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Wallet *
              </label>
              <div className='flex gap-3'>
                {user_Wallet.map((wallet) => (
                  <div
                    key={wallet}
                    onClick={() => handleWalletSelect(wallet)}
                    className={`flex flex-col items-center justify-center w-20 
                    border-4 h-16 rounded-2xl cursor-pointer 
                    duration-300 hover:duration-300 ${current_wallet === wallet
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-black hover:bg-gray-100'
                      }`}
                  >
                    <Wallet size={24} color={current_wallet === wallet ? "green" : "black"} />
                    <div>
                      <p className="text-xs">{wallet}</p>
                    </div>
                  </div>
                ))}
                {/* New Wallet Card */}
                <div
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-center justify-center w-20 border-2 border-dashed border-gray-400 h-16 rounded-2xl cursor-pointer hover:bg-gray-50"
                >
                  <Plus size={24} color="gray" />
                  <p className="text-sm mt-1 text-gray-500">New</p>
                </div>
              </div>
              {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
            </div>

            {/* Modal สำหรับเพิ่ม wallet */}
            {showModal && (
              <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
                  {/* Close button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-lg font-semibold mb-4">Create New Wallet</h2>
                  <input
                    type="text"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder="Enter wallet name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddWallet}
                    className="mt-4 w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700 transition-colors"
                  >
                    Add Wallet
                  </button>
                </div>
              </div>
            )}
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
              </div>
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Where did this transaction occur?"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Add any additional notes..."
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}