import { useContext, useState,useEffect } from 'react';
import { useLocalStorage } from "usehooks-ts";
import { PmmContext } from '../context/PmmContext';
import { ArrowLeft, DollarSign, Calendar, MapPin, FileText, CreditCard, Tag, Wallet, Plus, X } from 'lucide-react';
import { parse } from 'path';

export function AddTransaction({ categories, paymentMethods, onCancel }) {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [note,setNote] = useState("");

  const [user] = useLocalStorage("currentUser", null);
  const { user_Wallet, setUserWallet } = useContext(PmmContext);
  const [current_wallet, setCurrentWallet] = useState(user_Wallet[0] || null);
  const [showModal, setShowModal] = useState(false);
  const [newWalletData, setNewWalletData] = useState({
    name: '',
    type: 'bank',
    balance: 0,
    color: '#3B82F6'
  });
  
  // --- Get current location ---
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude);
            setLng(position.coords.longitude);
        });
    }, []);

  const [transactionType, setTransactionType] = useState("Expense");
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().slice(0, 16),
    location: '',
    note: '',
    wallet: user_Wallet[0] || null, // เปลี่ยนเป็น object
  });
  const [errors, setErrors] = useState({});

  const availableCategories = categories.filter(cat => cat.type == transactionType);

  const formatDateForBackend = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString); // แปลงเป็น Date object
    const tzOffset = -date.getTimezoneOffset(); // offset นาที
    const sign = tzOffset >= 0 ? '+' : '-';
    const pad = (num) => String(num).padStart(2, '0');
    const hours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const minutes = pad(Math.abs(tzOffset) % 60);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${hours}:${minutes}`;
  };

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


  async function geocode(placeName, currentLat, currentLng) {

    try {
      const res = await fetch(`/salad-pirate-frontend/api/geocode?query=${placeName}`);
      const data = await res.json();
      console.log("@####### Data from google map",data)
      if (data.status !== "OK" || data.results.length === 0) {
        console.warn(`Location not found: "${placeName}", fallback to current location`);
        return {
          lat: currentLat,
          lng: currentLng
        };
      }

      return {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };

    } catch (err) {
      console.error("Geocode error:", err);

      
      return {
        lat: currentLat,
        lng: currentLng
      };
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const geo = await geocode(formData.location,lat,lng);

    
    // เพิ่ม lat , long เข้าไป ด้วย
    const payload = {
      categoryId: formData.category.categoryId,
      paymentMethodId: formData.paymentMethod.paymentMethodId,
      walletId: formData.wallet.walletId,
      amount: parseFloat(formData.amount),
      type: transactionType,
      occuredAt: formatDateForBackend(formData.date),
      transactionLocation: formData.location,
      note: note,// ส่งเฉพาะ id ไป backend
      latitude: geo.lat,
      longitude:geo.lng

    };

    let res;
    try {
      res = await fetch('https://muict.app/salad-pirate-backend/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-id': parseInt(user?.id),
        },
        body: JSON.stringify({
          ...payload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("BE response:", data);

        // Update wallet balance
        const transactionAmount = parseFloat(formData.amount);
        const updatedWallets = await Promise.all(
          user_Wallet.map(async (wallet) => {
            if (wallet.walletId === formData.wallet.walletId) {
              const newBalance =
                transactionType === "Expense"
                  ? wallet.balance - transactionAmount
                  : wallet.balance + transactionAmount;

              const res = await fetch(
                `https://muict.app/salad-pirate-backend/wallets/${parseInt(wallet.walletId)}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-User-id": String(user?.id),
                  },
                  body: JSON.stringify({
                    ...wallet,
                    balance: parseFloat(newBalance),
                  }),
                }
              );

              if (!res.ok) {
                console.log(wallet);
                console.log(res);
                console.error(`Failed to update wallet ${wallet.walletId}`);
              }

              return { ...wallet, balance: newBalance };
            }

            return wallet;
          })
        );

        setUserWallet(updatedWallets);
        setCurrentWallet(updatedWallets.find(w => w.walletId === formData.wallet.walletId));

        alert("Successful");
        setFormData(
          {
            amount: '',
            category: '',
            paymentMethod: '',
            date: new Date().toISOString().slice(0, 16),
            location: '',
            note: '',
            wallet: updatedWallets[0] || null,
          }
        )
        setNote('')
        window.location.reload();
      } else {
        alert("UnSuccessful");
        console.log("Error ", res);
      }
    } catch (err) {
      console.log(res);
      console.error(err);
      alert("Unsuccessful");
    }
  };

  // ฟังก์ชันกด Add wallet
  const handleAddWallet = async () => {
    if (newWalletData.name.trim() === '') return;

    try {
      const res = await fetch('https://muict.app/salad-pirate-backend/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-id': parseInt(user?.id),
        },
        body: JSON.stringify({
          name: newWalletData.name,
          type: newWalletData.type,
          balance: parseFloat(newWalletData.balance),
          color: newWalletData.color,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const updatedWallets = [...user_Wallet, data];
        setUserWallet(updatedWallets);
        setCurrentWallet(data);
        setFormData({ ...formData, wallet: data });

        setNewWalletData({
          name: '',
          type: 'bank',
          balance: 0,
          color: '#3B82F6',
        });
        setShowModal(false);

        console.log("✅ Wallet added successfully:", data);
      } else {
        console.error("❌ API Error:", data);
      }
    } catch (error) {
      console.error(" Fetch Error:", error);
    }
  };


  const handleSubmitImage = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const res = await fetch("/salad-pirate-frontend/api/ocr", {
      method: "POST",
      body: uploadForm,
    });
    console.log("Return from OCR ######### ")
    console.log(res)
    const data = await res.json();

  //   // Update React state correctly
  // setFormData(prev => ({
  //   ...prev,
  //   note: data.text
  // }));
    setNote(data.text)
    setLoading(false);


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
                  setTransactionType('Expense');
                  setFormData({ ...formData, category: '' });
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${transactionType === 'Expense'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setTransactionType('Income');
                  setFormData({ ...formData, category: '' });
                }}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${transactionType === 'Income'
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
                  value={formData.category?.categoryId || ''}
                  onChange={(e) => {
                    const selectedCategory = availableCategories.find(
                      (cat) => String(cat.categoryId) === e.target.value
                    );
                    setFormData({ ...formData, category: selectedCategory });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select a category</option>
                  {availableCategories.map((category) => (
                    <option key={category.categoryId} value={category.categoryId}>
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
                  value={formData.paymentMethod?.paymentMethodId || ''}
                  onChange={(e) => {
                    const selectedMethod = paymentMethods.find(
                      (method) => String(method.paymentMethodId) === e.target.value
                    );
                    setFormData({ ...formData, paymentMethod: selectedMethod });
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods.map((method) => (
                    <option key={method.paymentMethodId} value={method.paymentMethodId}>
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
              <div className='flex gap-3 flex-wrap'>
                {user_Wallet.map((wallet) => (
                  <div
                    key={wallet.walletId}
                    onClick={() => handleWalletSelect(wallet)}
                    className={`flex flex-col items-center justify-center w-24 
                    border-4 h-20 rounded-2xl cursor-pointer 
                    duration-300 hover:duration-300 ${current_wallet?.walletId === wallet.walletId
                        ? 'border-green-500 bg-green-100 text-green-700'
                        : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    style={{ borderColor: current_wallet?.walletId === wallet.walletId ? '#10B981' : wallet.color }}
                  >
                    <div className="flex flex-col text-center justify-center items-center ">
                      <Wallet />
                      <p className="text-xs font-medium truncate w-20" title={wallet.name}>

                        {wallet.name}
                      </p>
                    </div>
                  </div>
                ))}
                {/* New Wallet Card */}
                <div
                  onClick={() => setShowModal(true)}
                  className="flex flex-col items-center justify-center w-24 border-2 border-dashed border-gray-400 h-20 rounded-2xl cursor-pointer hover:bg-gray-50"
                >
                  <Plus size={24} color="gray" />
                  <p className="text-xs mt-1 text-gray-500">New</p>
                </div>
              </div>
              {errors.wallet && <p className="text-red-500 text-sm mt-1">{errors.wallet}</p>}
            </div>

            {/* Modal สำหรับเพิ่ม wallet */}
            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
                  {/* Close button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>

                  <h2 className="text-lg font-semibold mb-4">Create New Wallet</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Wallet Name
                      </label>
                      <input
                        type="text"
                        value={newWalletData.name}
                        onChange={(e) => setNewWalletData({ ...newWalletData, name: e.target.value })}
                        placeholder="Enter wallet name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={newWalletData.type}
                        onChange={(e) => setNewWalletData({ ...newWalletData, type: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      >
                        <option value="bank">Bank Account</option>
                        <option value="cash">Cash</option>
                        <option value="credit">Credit Card</option>
                        <option value="savings">Savings</option>
                        <option value="investment">Investment</option>
                        <option value="digital">Digital Wallet</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Initial Balance
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newWalletData.balance}
                        onChange={(e) => setNewWalletData({ ...newWalletData, balance: e.target.value })}
                        placeholder="0.00"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={newWalletData.color}
                          onChange={(e) => setNewWalletData({ ...newWalletData, color: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded-lg"
                        />
                        <div
                          className="w-10 h-10 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: newWalletData.color }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddWallet}
                    className="mt-6 w-full bg-emerald-600 text-white rounded-lg py-2 hover:bg-emerald-700 transition-colors"
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
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
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


        <div className="p-6 border-2 rounded-4xl m-5 border-gray-300">
          <h1 className="text-xl font-bold mb-4">Upload receipt!</h1>

          <form onSubmit={handleSubmitImage}>
            <div className='flex justify-between'>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
              >
                {loading ? "Processing..." : "Upload"}
              </button>
            </div>
          </form>

          {text && (
            <div className="mt-4">
              <h2 className="font-semibold">Extracted Text:</h2>
              <pre className="bg-gray-100 p-2 rounded">{text}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}