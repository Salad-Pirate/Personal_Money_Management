import React from 'react'

const CategroyModal = () => {
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

export default CategroyModal