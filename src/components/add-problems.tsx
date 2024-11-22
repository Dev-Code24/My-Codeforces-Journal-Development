import { useEffect, useState } from "react";
import Button from "../ui/button";
import { checkCodeforcesSite } from "../util/utility";
import { storage } from "../storage-fallback";

const AddProblems = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [error, setError] = useState("noerror");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
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
  }, [currentUrl]);

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
      <Button onClick={openModalOnPage} disabled={DEV_OR_PROD === "production" ? isButtonDisabled : false}>
        Add this problem
      </Button>

      {error !== "noerror" && <p className="text-[10px]">*Error: {error}</p>}
    </div>
  );
};

export default AddProblems;
