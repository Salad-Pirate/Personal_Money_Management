'use client';
import { useLocalStorage } from "usehooks-ts";
import { useState, useEffect} from "react";

import Login from "./(auth)/AuthPage/page";
import { Dashboard } from "./components/dashboard";
import { Navigation } from "./components/navigation";
import { AddTransaction } from "./components/addtransaction";
import { TransactionsList } from "./components/transactionlist";
import {Settings_PPM} from "./components/settings"

export default function Home() {
  const [user, setUser] = useLocalStorage("currentUser", null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("http://localhost:8080/transactions/get-transactions");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTransactions(data);   // Spring Boot จะส่ง JSON Array กลับมา
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }
    fetchTransactions();
  }, []);

  // const [transactions, setTransactions] = useState([
  //   { id: 1, type: "income", amount: 1200, category: "Salary", date: "2025-09-01T10:30", paymentMethod: "Bank" },
  //   { id: 2, type: "expense", amount: 300, category: "Food", date: "2025-09-02T12:00", paymentMethod: "Cash" },
  // ]);

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

  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, { id: transactions.length + 1, ...transaction }]);
    setCurrentPage("dashboard");
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      <main className="pt-20 pb-20 px-4">
        {currentPage === "dashboard" && <Dashboard transactions={transactions} />}
        {currentPage === "add-transaction" && (
          <AddTransaction
            categories={categories}
            paymentMethods={paymentMethods}
            onAddTransaction={handleAddTransaction}
            onCancel={() => setCurrentPage("dashboard")}
          />
        )}
        {currentPage === "transactions" && (
          <TransactionsList 
            transactions={transactions} 
            categories={categories} 
            paymentMethods={paymentMethods} 
          />
        )}
        {currentPage === "settings" && (
            <Settings_PPM
                categories={categories}
                paymentMethods={paymentMethods}
                onUpdateCategories={setCategories}
                onUpdatePaymentMethods={setPaymentMethods}
                user={user}
                onLogout={() => setUser(null)}
            />
        
        )}
      </main>
    </>
  );
}
