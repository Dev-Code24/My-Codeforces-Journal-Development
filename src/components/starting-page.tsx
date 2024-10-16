import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import WelcomePage from "./welcome-page";
import AppsScriptForm from "./forms/appscript-form";
import CodeforcesForm from "./forms/codeforces-form";
import { handleVerifyCodeforcesId } from "../services/verify-codeforces-id";
import { handleVerifyAppScriptUrl } from "../services/verify-appscript-url";
import AddProblems from "./add-problems";
import SettingsMenu from "./settings/settings-menu";

const StartingPage: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [appScriptUrl, setAppScriptUrl] = useState("https://script.google.com/macros/s/");
  const [codeforcesId, setCodeforcesId] = useState("https://codeforces.com/profile/user__Id");
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [problemDetails, setProblemDetails] = useState({
    problemName: "",
    problemRating: "",
    problemStatus: "",
    remarks: "",
    dateSolved: "",
    takeaways: "",
    problemTopics: "",
  });

  const handleTryAgainCodeforcesForm = () => {
    setCodeforcesId("https://codeforces.com/profile/user__Id");
    setError(false);
  };
  const handleTryAgainAppScriptForm = () => {
    setAppScriptUrl("https://script.google.com/macros/s/");
    setError(false);
  };
  return (
    <div className="p-2 h-full flex flex-col">
      {/* Top */}
      <div className={`flex items-center ${window.SETUP_COMPLETE ? "justify-between mx-4" : "justify-center"}`}>
        <h1 className="text-lg font-semibold text-center">My Codeforces Journal</h1>
        {window.SETUP_COMPLETE && (
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
        {window.SETUP_COMPLETE === false ? (
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
        {pageNumber < 4 && (
          <div className="buttons flex justify-between items-center mx-auto max-w-[355px] mt-2">
            {!error && (
              <>
                {pageNumber !== 1 ? (
                  <>
                    <Button onClick={() => setPageNumber((prev) => prev - 1)}>Prev</Button>
                    <div className="flex-grow" />
                    {pageNumber == 2 ? (
                      <>
                        <Button onClick={() => handleVerifyCodeforcesId(codeforcesId, setError, setPageNumber, setLoading, undefined)}>Next</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleVerifyAppScriptUrl(appScriptUrl, setError, setPageNumber, setLoading, undefined)}>Submit</Button>
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
