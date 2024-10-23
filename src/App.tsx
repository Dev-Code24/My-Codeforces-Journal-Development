import { useEffect, useState } from "react";
import StartingPage from "./components/starting-page";
import { storage } from "./storage-fallback";

const App: React.FC = () => {
  const [setupComplete, setSetupComplete] = useState(false);
  useEffect(() => {
    storage.get(["SETUP_COMPLETE"], (result) => {
      setSetupComplete(result.SETUP_COMPLETE || "");
    });
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === "local" && changes.SETUP_COMPLETE) {
        setSetupComplete(changes.SETUP_COMPLETE.newValue || "");
      }
    };

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
    }

    // Cleanup listeners when the component is unmounted
    return () => {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      }
    };
  }, [window.SETUP_COMPLETE]);

  return (
    <div className={`font-Averta text-primary-black bg-primary-light ${!setupComplete ? "h-[400px] w-[400px]" : "h-[300px] w-[300px]"}`}>
      <StartingPage />
    </div>
  );
};

export default App;
