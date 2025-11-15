"use client";

import { parse } from "path";
import { useEffect, useState, useContext } from "react";
import React from 'react'
import { PmmContext } from '../context/PmmContext';
const LocationSuggest = () => {
    const [locations, setLocations] = useState([]);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const { user_transaction } = useContext(PmmContext)
    const locations_info = user_transaction.map(tx => ({
        name: tx.transactionLocation,
        lat: tx.latitude,
        lng: tx.longitude
    }));

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;


            setLat(userLat);
            setLng(userLng);

            const query = locations_name.map(encodeURIComponent).join(",");

            const res = await fetch(
                `/api/nearby?lat=${userLat}&lng=${userLng}&places=${query}`
            );
            const data = await res.json();
            setLocations(data.results);
            console.log(res)
            console.log(data)

        });
    }, []);

    return (
        <div>
            <p> latitude {lat}</p>
            <p> Longtitude {lng} </p>
            {/* <h1>Nearby Location {locations}</h1> */}
        </div>
    )
}

export default LocationSuggest