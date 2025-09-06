
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, LogOut, CreditCard, Tag } from 'lucide-react';

export default function Settings({
    categories,
    paymentMethods,
    onUpdateCategories,
    onUpdatePaymentMethods,
    user,
    onLogout
}) {
    const [activeSection, setActiveSection] = useState('categories');
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);

    const sections = [
        { id: 'categories', label: 'Categories', icon: Tag },
        { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const CategoryModal = () => {
        const [formData, setFormData] = useState({
            name: editingCategory?.name || '',
            type: editingCategory?.type || 'expense',
            color: editingCategory?.color || '#3B82F6',
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.name.trim()) return;

            if (editingCategory) {
                onUpdateCategories(categories.map(cat =>
                    cat.id === editingCategory.id
                        ? { ...editingCategory, ...formData }
                        : cat
                ));
            } else {
                onUpdateCategories([
                    ...categories,
                    { id: Date.now().toString(), ...formData }
                ]);
            }

            setShowCategoryModal(false);
            setEditingCategory(null);
            setFormData({ name: '', type: 'expense', color: '#3B82F6' });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="Category name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 rounded-lg"
                                />
                                <div
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300"
                                    style={{ backgroundColor: formData.color }}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCategoryModal(false);
                                    setEditingCategory(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                {editingCategory ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const PaymentMethodModal = () => {
        const [formData, setFormData] = useState({
            name: editingPayment?.name || '',
            color: editingPayment?.color || '#3B82F6',
        });

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!formData.name.trim()) return;

            if (editingPayment) {
                onUpdatePaymentMethods(paymentMethods.map(method =>
                    method.id === editingPayment.id
                        ? { ...editingPayment, ...formData }
                        : method
                ));
            } else {
                onUpdatePaymentMethods([
                    ...paymentMethods,
                    { id: Date.now().toString(), ...formData }
                ]);
            }

            setShowPaymentModal(false);
            setEditingPayment(null);
            setFormData({ name: '', color: '#3B82F6' });
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                placeholder="Payment method name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 rounded-lg"
                                />
                                <div
                                    className="w-10 h-10 rounded-lg border-2 border-gray-300"
                                    style={{ backgroundColor: formData.color }}
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setEditingPayment(null);
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            >
                                {editingPayment ? 'Update' : 'Add'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const deleteCategory = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            onUpdateCategories(categories.filter(cat => cat.id !== categoryId));
        }
    };

    const deletePaymentMethod = (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment method?')) {
            onUpdatePaymentMethods(paymentMethods.filter(method => method.id !== paymentId));
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your categories, payment methods, and profile settings.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <nav className="p-4 space-y-2">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${activeSection === section.id
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        {section.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        {activeSection === 'categories' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                                    <button
                                        onClick={() => setShowCategoryModal(true)}
                                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Category
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-4 h-4 rounded-full mr-3"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{category.name}</p>
                                                        <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingCategory(category);
                                                            setShowCategoryModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteCategory(category.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'payment-methods' && (
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Add Payment Method
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div
                                                        className="w-4 h-4 rounded-full mr-3"
                                                        style={{ backgroundColor: method.color }}
                                                    />
                                                    <p className="font-medium text-gray-900">{method.name}</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingPayment(method);
                                                            setShowPaymentModal(true);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => deletePaymentMethod(method.id)}
                                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeSection === 'profile' && (
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>

                                <div className="space-y-6">
                                    <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button
                                            onClick={onLogout}
                                            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <LogOut className="w-5 h-5 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCategoryModal && <CategoryModal />}
            {showPaymentModal && <PaymentMethodModal />}
        </div>
    );
}