import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { storage } from "./storage-fallback";

// Default values for Chrome storage variables
const defaultValues = {
  APP_SCRIPT_URL: "",
  CODEFORCES_ID: "",
  CODEFORCES_AVATAR_URL: "",
  CODEFORCES_VERIFIED: false,
  APPSCRIPT_VERIFIED: false,
  SETUP_COMPLETE: false,
  CURRENT_TAB_URL: "",
};

// Function to initialize storage with default values using storageFallback
const initializeStorageDefaults = () => {
  // Get current values using storageFallback's get method
  storage.get(Object.keys(defaultValues), (result) => {
    // Create newValues object that allows setting values dynamically with correct types
    const newValues: Partial<Record<keyof typeof defaultValues, string | boolean>> = {};

    // Loop through defaultValues and check if they are already set
    for (const key of Object.keys(defaultValues) as Array<keyof typeof defaultValues>) {
      if (result[key] === undefined) {
        // If a value is not set, assign the default value
        newValues[key] = defaultValues[key];
      }
    }

    // If there are any undefined values, set them with the default values
    if (Object.keys(newValues).length > 0) {
      storage.set(newValues, () => {
        console.log("Default storage values have been set:", newValues);
      });
    }
  });
};

// Run the initialization before rendering the app
initializeStorageDefaults();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
