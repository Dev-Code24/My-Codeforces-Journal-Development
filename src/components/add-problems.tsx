import { useEffect, useState } from "react";
import Button from "../ui/button";
import { checkCodeforcesSite } from "../util/utility";
import { storage } from "../storage-fallback";
import { handleAddProblems } from "../services/add-problem";

const DEV_OR_PROD = import.meta.env.VITE_DEV_OR_PROD;
console.log("DEV_OR_PROD " + DEV_OR_PROD);

const AddProblems = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [error, setError] = useState("noerror");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (DEV_OR_PROD === "prod") {
      // Production: Use Chrome API to get current tab's URL
      if (typeof chrome !== "undefined" && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0] && tabs[0].url) {
            const url = tabs[0].url;
            setCurrentUrl(url);
            storage.set(
              {
                CURRENT_TAB_URL: url,
              },
              () => {
                window.CURRENT_TAB_URL = url;
              }
            );

            const isValidSite = checkCodeforcesSite(url, setError);
            setIsButtonDisabled(!isValidSite);
          }
        });
      } else {
        console.warn("Chrome tabs API is not available in this environment.");
      }
    } else {
      // Development: Set current URL manually and enable dev mode
      window.CURRENT_TAB_URL = currentUrl;
    }
  }, [currentUrl]);

  // Environment-specific `onClick` handler and button properties
  const handleClick = () => {
    if (DEV_OR_PROD === "prod") {
      openModalOnPage();
    } else {
      const data: { status: string; takeaways: string; remarks: string } = {
        status: "developing",
        takeaways: "developing",
        remarks: "developing",
      };
      handleAddProblems(data, (message, success) => {
        if (success) {
          console.log({ status: "success", result: message });
        } else {
          console.error({ status: "error", error: message });
        }
      });
    }
  };

  const openModalOnPage = () => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].id) {
          console.log("Opening form modal...");
          chrome.tabs.sendMessage(tabs[0].id, { action: "openModal" });
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-center h-full flex-col">
      <Button onClick={handleClick} disabled={DEV_OR_PROD === "prod" ? isButtonDisabled : false}>
        Add this problem
      </Button>

      {/* Conditionally render the input in development environment */}
      {DEV_OR_PROD === "dev" && <input type="text" value={currentUrl} onChange={(e) => setCurrentUrl(e.target.value)} />}

      {error !== "noerror" && <p className="text-[10px]">*Error: {error}</p>}
    </div>
  );
};

export default AddProblems;
