"use client";

import { useState, useEffect } from "react";

export const useGooglePlaces = () => {
    const [apiKey, setApiKey] = useState<string>("");
    
    useEffect(() => {
        // Get the API key from environment variables
        const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || "AIzaSyB35oxo6K7x76l4yAwIU6A1wKYr5fikq3Y";
        console.log("useGooglePlaces: Environment key:", process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY ? "Found" : "Not found");
        console.log("useGooglePlaces: Using key:", googleApiKey ? googleApiKey.substring(0, 10) + "..." : "None");
        setApiKey(googleApiKey);
    }, []);

    console.log("useGooglePlaces: Hook returning - apiKey:", apiKey ? "Present" : "Missing", "isReady:", !!apiKey);

    return {
        apiKey,
        isReady: !!apiKey
    };
}; 