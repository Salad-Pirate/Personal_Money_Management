'use client';
import { useLocalStorage } from "usehooks-ts";
import { useState,useContext } from "react";

import Login from "./(auth)/AuthPage/page";
import { Dashboard } from "./components/dashboard";
import { Navigation } from "./components/navigation";
import { AddTransaction } from "./components/addtransaction";
import { TransactionsList } from "./components/transactionlist";
import {Settings_PPM} from "./components/settings"
import { PmmContext } from "./context/PmmContext";

export default function Home() {
  const [user, setUser] = useLocalStorage("currentUser", null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userID,setUserID] = useLocalStorage("UserID", null);
  const { userPaymet,setUserPaymet,userCategory, setUserCategory, user_transaction } = useContext(PmmContext)

  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", amount: 1200, category: "Salary", date: "2025-09-01T10:30", paymentMethod: "Bank" },
    { id: 2, type: "expense", amount: 300, category: "Food", date: "2025-09-02T12:00", paymentMethod: "Cash" },
  ]);


  const [categories, setCategories] = useLocalStorage('categories', [
        { id: '1', name: 'Food & Dining', type: 'expense', color: '#EF4444' },
        { id: '2', name: 'Transportation', type: 'expense', color: '#F97316' },
        { id: '3', name: 'Shopping', type: 'expense', color: '#8B5CF6' },
        { id: '4', name: 'Salary', type: 'income', color: '#10B981' },
        { id: '5', name: 'Freelance', type: 'income', color: '#06B6D4' },
    ]);





  const handleAddTransaction = (transaction) => {
    setTransactions([...transactions, { id: transactions.length + 1, ...transaction }]);
    setCurrentPage("dashboard");
  };

  if (!user) return <Login onLogin={setUser} />;

  const handleLogout = () =>{
    setUser(null)
    setUserID(null)
  }
  return (
    <>
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      <main className="pt-20 pb-20 px-4">
        {currentPage === "dashboard" && <Dashboard transactions={user_transaction} />}
        {currentPage === "add-transaction" && (
          <AddTransaction
            categories={userCategory}
            paymentMethods={userPaymet}
            onAddTransaction={handleAddTransaction}
            onCancel={() => setCurrentPage("dashboard")}
          />
        )}
        {currentPage === "transactions" && (
          <TransactionsList 
            transactions={user_transaction} 
            categories={userCategory} 
            paymentMethods={userPaymet} 
          />
        )}
        {currentPage === "settings" && (
            <Settings_PPM
                categories={userCategory}
                paymentMethods={userPaymet}
                onUpdateCategories={setUserCategory}
                onUpdatePaymentMethods={setUserPaymet}
                user={user}
                onLogout={handleLogout}
            />
        
        )}
      </main>
    </>
  );
}
