import { NextResponse } from "next/server";

const PLACES = [
  "Mahidol University Salaya",
  "Cafe Amazon Salaya",
  "Lotus Salaya",
  "7-Eleven Phutthamonthon"
];

// Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Geocode using Google API
async function geocode(placeName) {
  const apikey = "AAAAA"
  // const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    placeName
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== "OK" || data.results.length === 0) return null;

  return {
    lat: data.results[0].geometry.location.lat,
    lng: data.results[0].geometry.location.lng,
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userLat = parseFloat(searchParams.get("lat"));
  const userLng = parseFloat(searchParams.get("lng"));
  const placesParam = searchParams.get("places"); // "Salaya,Bangkok,Nakhon Pathom"
  const places = placesParam.split(","); // ["Salaya", "Bangkok", "Nakhon Pathom"]

  if (!userLat || !userLng) {
    return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
  }

  const results = [];

  for (const name of places) {
    const geo = await geocode(name);
    if (!geo) continue;

    const distance = haversine(userLat, userLng, geo.lat, geo.lng);

    results.push({
      name,
      lat: geo.lat,
      lng: geo.lng,
      distance,
    });
  }

  // sort by nearest
  results.sort((a, b) => a.distance - b.distance);

  return NextResponse.json({ results });
}
