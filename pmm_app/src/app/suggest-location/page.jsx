"use client";

import React from 'react'
import { parse } from "path";
import { useEffect, useState, useContext } from "react";
import { PmmContext } from '../context/PmmContext';
import { Search, Filter, TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';

const Suggest = () => {
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const { user_transaction } = useContext(PmmContext)

    // --- Get current location ---
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude
            const long = position.coords.longitude
            setLat(lat);
            setLng(long);
        });
    }, []);
    

    function getDistanceKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function filterNearbyLocations(currentLat, currentLng, transactions, maxDistanceKm = 15) {
        return transactions
            .map(tx => ({
                ...tx,
                distance: getDistanceKm(currentLat, currentLng, tx.latitude, tx.longitude)
            }))
            .filter(tx => tx.distance <= maxDistanceKm);
    }

     // ป้องกัน crash ตอน lat/lng ยังไม่โหลด

    if (lat === null || lng === null) {
        return <p className="p-6">กำลังหาตำแหน่งปัจจุบัน...</p>;
    }

    const nearbyLocations = filterNearbyLocations(lat, lng, user_transaction);

    const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {nearbyLocations.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <h1> No have transaction that nearby from your current location </h1>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {nearbyLocations.map((transaction) => (
                        <div
                            key={transaction.transactionId}
                            className="px-6 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">

                                    {/* Icon Box */}
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-gray-700" />
                                    </div>

                                    {/* Main Transaction Info */}
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {transaction.categoryName}
                                        </h3>

                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            {formatDate(transaction.occuredAt)}

                                            <span className="mx-2">•</span>
                                            {transaction.paymentMethodName}

                                            {transaction.transactionLocation && (
                                                <>
                                                    <span className="mx-2">•</span>
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {transaction.transactionLocation}
                                                </>
                                            )}
                                        </div>

                                        {transaction.note && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {transaction.note}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Amount */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    )
}

export default Suggest