'use client'

import Settings from '@/components/Setting'
import React from 'react'
import { useLocalStorage } from 'usehooks-ts'

const page = () => {

    const [user, setUser] = useLocalStorage('currentUser', null);

    const [categories, setCategories] = useLocalStorage('categories', [
        { id: '1', name: 'Food & Dining', type: 'expense', color: '#EF4444' },
        { id: '2', name: 'Transportation', type: 'expense', color: '#F97316' },
        { id: '3', name: 'Shopping', type: 'expense', color: '#8B5CF6' },
        { id: '4', name: 'Salary', type: 'income', color: '#10B981' },
        { id: '5', name: 'Freelance', type: 'income', color: '#06B6D4' },
    ]);

    const [paymentMethods, setPaymentMethods] = useLocalStorage('paymentMethods', [
        { id: '1', name: 'Credit Card', color: '#3B82F6' },
        { id: '2', name: 'Cash', color: '#6B7280' },
        { id: '3', name: 'Debit Card', color: '#8B5CF6' },
    ]);

    return (
        <>
            <Settings
                categories={categories}
                paymentMethods={paymentMethods}
                onUpdateCategories={setCategories}
                onUpdatePaymentMethods={setPaymentMethods}
                user={user}
                onLogout={() => setUser(null)}
            />
        </>
    )
}

export default page