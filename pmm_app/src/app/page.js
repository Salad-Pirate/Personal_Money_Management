'use client';
import { useLocalStorage } from "usehooks-ts";
import { useState } from "react";
import Login from "./(auth)/AuthPage/page";
import { Dashboard } from "./components/dashboard";
import { Navigation } from "./components/navigation";
import { AddTransaction } from "./components/addtransaction";

export default function Home() {
  const [user, setUser] = useLocalStorage("currentUser", null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // mock data
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", amount: 1200, category: "Salary", date: "2025-09-01T10:30", paymentMethod: "Bank" },
    { id: 2, type: "expense", amount: 300, category: "Food", date: "2025-09-02T12:00", paymentMethod: "Cash" },
  ]);

  // category + payment method ตัวอย่าง
  const categories = [
    { id: 1, name: "Food", type: "expense" },
    { id: 2, name: "Transport", type: "expense" },
    { id: 3, name: "Salary", type: "income" },
    { id: 4, name: "Freelance", type: "income" },
  ];

  const paymentMethods = [
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
    { id: 3, name: "Credit Card" },
  ];

  const handleAddTransaction = (transaction) => {
    setTransactions([
      ...transactions,
      { id: transactions.length + 1, ...transaction },
    ]);
    setCurrentPage("dashboard"); // กลับไป Dashboard หลังบันทึก
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <>
      <Navigation
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        user={user}
      />

      <main className="pt-20 pb-20 px-4">
        {currentPage === "dashboard" && (
          <Dashboard transactions={transactions} />
        )}

        {currentPage === "add-transaction" && (
          <AddTransaction
            categories={categories}
            paymentMethods={paymentMethods}
            onAddTransaction={handleAddTransaction}
            onCancel={() => setCurrentPage("dashboard")}
          />
        )}

        {currentPage === "transactions" && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">All Transactions</h1>
            <ul className="space-y-2">
              {transactions.map((t) => (
                <li
                  key={t.id}
                  className="p-4 bg-white rounded-lg shadow border flex justify-between"
                >
                  <span>{t.category} ({t.type})</span>
                  <span>{t.amount} ฿</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {currentPage === "settings" && (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold">Settings</h1>
            <button
              onClick={() => setUser(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </>
  );
}
