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
