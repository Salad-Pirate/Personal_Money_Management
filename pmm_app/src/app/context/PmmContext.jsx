'use client'

import React, { createContext } from 'react'
import { useState, useEffect } from 'react';
import { useLocalStorage } from "usehooks-ts";

export const PmmContext = createContext();

export const PmmContextProvider = (props) => {
    const [user] = useLocalStorage("currentUser", null);
    const [user_Wallet, setUserWallet] = useState([]);
    const [userPaymet, setUserPaymet] = useState([]);
    const [userCategory, setUserCategory] = useState([]);
    const [user_id, setUser_id] = useState(null);
    const [user_transaction , setUserTransaction] = useState([]);
    const Get_Wallet = async () => {
        try {
            const res = await fetch('http://localhost:8080/wallets', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-User-id": parseInt(user?.id),
                }
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Fetch Success:", data);
                setUserWallet(data);
            } else {
                console.log("Fetch failed:", data);
                setUserWallet([]);
            }
        } catch (error) {
            console.log("Fail to Fetch Wallet", error);
        };
    }

    const Get_userPaymet = async () => {
        try {
            const res = await fetch('http://localhost:8080/payment-methods', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-User-id": parseInt(user?.id),
                }
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Fetch Success:", data);
                setUserPaymet(data);
            } else {
                console.log("Fetch failed:", data);
                setUserPaymet([]);
            }
        } catch (error) {
            console.log("Fail to Fetch Payment Methods", error);
        };
    }


    const Get_Category = async () => {
        try {
            const res = await fetch('http://localhost:8080/categories', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-User-id": parseInt(user?.id),
                }
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Fetch Success:", data);
                setUserCategory(data);
            } else {
                console.log("Fetch failed:", data);
                setUserCategory([]);
            }
        } catch (error) {
            console.log("Fail to Fetch Category", error);
        };
    }


    const Get_Transaction = async () =>{
        try {
            const res = await fetch('http://localhost:8080/transactions', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "X-User-id": parseInt(user?.id),
                }
            });
            const data = await res.json();
            if (res.ok) {
                console.log("Fetch Success:", data);
                setUserTransaction(data);
            } else {
                console.log("Fetch failed:", data);
                setUserTransaction([]);
            }
        } catch (error) {
            console.log("Fail to Fetch Category", error);
        };
    }
    useEffect(() => {
        Get_Wallet();
        Get_userPaymet();
        Get_Category();
        Get_Transaction();
    }, []);


    const value = {
        user_Wallet, setUserWallet, user_id, setUser_id, userPaymet, setUserPaymet
        ,userCategory, setUserCategory,user_transaction , setUserTransaction
    };


    return (
        <PmmContext.Provider value={value}>
            {props.children}
        </PmmContext.Provider>
    )
}