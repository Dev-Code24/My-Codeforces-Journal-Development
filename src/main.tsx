import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize global variables
window.APP_SCRIPT_URL = "https://script.google.com/macros/s/SECRET_HASH/exec";
window.CODEFORCES_ID = " ";
window.CODEFORCES_AVATAR_URL = " ";
window.CODEFORCES_VERIFIED = false;
window.APPSCRIPT_VERIFIED = false;
window.SETUP_COMPLETE = false;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
