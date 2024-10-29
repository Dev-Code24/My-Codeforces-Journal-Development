import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import WelcomePage from "./welcome-page";
import AppsScriptForm from "./forms/appscript-form";
import CodeforcesForm from "./forms/codeforces-form";
import { handleVerifyCodeforcesId } from "../services/verify-codeforces-id";
import { handleVerifyAppScriptUrl } from "../services/verify-appscript-url";
import AddProblems from "./add-problems";
import SettingsMenu from "./settings/settings-menu";
import { storage } from "../storage-fallback";
import { checkAppScriptUrl, checkCodeforcesUrl } from "../util/utility";

const DEV_OR_PROD = import.meta.env.VITE_DEV_OR_PROD;

const StartingPage: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [appScriptUrl, setAppScriptUrl] = useState("https://script.google.com/macros/s/");
  const [codeforcesId, setCodeforcesId] = useState("https://codeforces.com/profile/user__Id");
  const [correctCodeforcesId, setCorrectCodeforcesId] = useState(false);
  const [correctAppScriptUrl, setCorrectAppScriptUrl] = useState(false);
  const [error, setError] = useState("NoError");
  const [isLoading, setLoading] = useState(false);
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

  useEffect(() => {
    setCorrectCodeforcesId(checkCodeforcesUrl(codeforcesId));
    if (DEV_OR_PROD === "dev") console.log(correctCodeforcesId);
  }, [codeforcesId]);
  useEffect(() => {
    setCorrectAppScriptUrl(checkAppScriptUrl(appScriptUrl));
    if (DEV_OR_PROD === "dev") console.log(correctAppScriptUrl);
  }, [appScriptUrl]);

  const handleTryAgainCodeforcesForm = () => {
    setCodeforcesId("https://codeforces.com/profile/user__Id");
    setError("NoError");
  };
  const handleTryAgainAppScriptForm = () => {
    setAppScriptUrl("https://script.google.com/macros/s/");
    setError("NoError");
  };
  return (
    <div className="p-2 h-full flex flex-col">
      {/* Top */}
      <div className={`flex items-center ${setupComplete ? "justify-between mx-4" : "justify-center"}`}>
        <h1 className="text-lg font-semibold text-center">My Codeforces Journal</h1>
        {setupComplete && (
          <SettingsMenu
            codeforcesId={codeforcesId}
            setCodeforcesId={setCodeforcesId}
            error={error}
            setError={setError}
            isLoading={isLoading}
            setLoading={setLoading}
            handleTryAgainCodeforcesForm={handleTryAgainCodeforcesForm}
            appScriptUrl={appScriptUrl}
            setAppScriptUrl={setAppScriptUrl}
            handleTryAgainAppScriptForm={handleTryAgainAppScriptForm}
          />
        )}
      </div>
      <div className="flex-grow">
        {/* Center */}
        {!setupComplete ? (
          <div className="h-[285px]">
            {pageNumber === 1 && <WelcomePage />}
            {pageNumber === 2 && (
              <CodeforcesForm
                codeforcesId={codeforcesId}
                setCodeforcesId={setCodeforcesId}
                error={error}
                isLoading={isLoading}
                onTryAgain={handleTryAgainCodeforcesForm}
              />
            )}
            {pageNumber === 3 && (
              <AppsScriptForm
                url={appScriptUrl}
                setUrl={setAppScriptUrl}
                error={error}
                isLoading={isLoading}
                onTryAgain={handleTryAgainAppScriptForm}
              />
            )}
          </div>
        ) : (
          <AddProblems />
        )}

        {/* Bottom */}
        {!setupComplete && pageNumber < 4 && (
          <div className="buttons flex justify-between items-center mx-auto max-w-[355px] mt-2">
            {error.includes("NoError") && (
              <>
                {pageNumber !== 1 ? (
                  <>
                    <Button onClick={() => setPageNumber((prev) => prev - 1)}>Prev</Button>
                    <div className="flex-grow" />
                    {pageNumber == 2 ? (
                      <>
                        <Button
                          disabled={!correctCodeforcesId}
                          onClick={() => handleVerifyCodeforcesId(codeforcesId, setError, setPageNumber, setLoading, undefined)}
                        >
                          Next
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          disabled={!correctAppScriptUrl}
                          onClick={() => handleVerifyAppScriptUrl(appScriptUrl, setError, setPageNumber, setLoading, undefined)}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <div />
                    <Button className="ml-auto" onClick={() => setPageNumber((prev) => prev + 1)}>
                      Next
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartingPage;
