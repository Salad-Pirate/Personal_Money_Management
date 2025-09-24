'use client'

import React, { createContext } from 'react'
import { useState } from 'react';


export const PmmContext = createContext();

export const PmmContextProvider = (props) => {
    // const [user_Wallet, setUserWallet] = useState(["wallet1", "wallet2", "wallet3"]);
    const [user_Wallet, setUserWallet] = useState([
        {
            id: "1",
            name: "Main Bank Account",
            type: "bank",
            balance: 2500.75,
            color: "#3B82F6"
        },
        {
            id: "2",
            name: "Cash Wallet",
            type: "cash",
            balance: 150.00,
            color: "#10B981"
        },
        {
            id: "3",
            name: "Credit Card",
            type: "credit",
            balance: -450.25,
            color: "#EF4444"
        },
        {
            id: "4",
            name: "Savings Account",
            type: "savings",
            balance: 5000.00,
            color: "#8B5CF6"
        },
    ]);
    const [token, setToken] = useState(null);
    const [user_id, setUser_id] = useState(null);
    

    const value = {
        user_Wallet, setUserWallet, user_id, setUser_id
    };
    return (
        <PmmContext.Provider value={value}>
            {props.children}
        </PmmContext.Provider>
    )
}