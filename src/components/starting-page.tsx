import React, { useEffect, useState } from "react";
import Button from "../ui/button";
import WelcomePage from "./welcome-page";
import SpreadsheetForm from "./forms/spreadsheet-form";
import CodeforcesForm from "./forms/codeforces-form";
import { handleVerifyCodeforcesId } from "../services/verify-codeforces-id";
import { handleVerifyAppScriptUrl } from "../services/verify-appscript-url";
import AddProblems from "./add-problems";

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

  useEffect(() => {
    console.log(codeforcesId);
  }, [codeforcesId]);

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
      <h1 className="text-lg font-semibold mb-4 text-center">My Codeforces Journal</h1>
      <div className="flex-grow">
        {/* Center */}
        {window.SETUP_COMPLETE === false ? (
          <div className="h-[285px]">
            {pageNumber === 1 && <WelcomePage />}
            {pageNumber === 2 && (
              <CodeforcesForm
                pageNumber={pageNumber}
                codeforcesId={codeforcesId}
                setCodeforcesId={setCodeforcesId}
                error={error}
                isLoading={isLoading}
                onTryAgain={handleTryAgainCodeforcesForm}
              />
            )}
            {pageNumber === 3 && (
              <SpreadsheetForm
                pageNumber={pageNumber}
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
                        <Button onClick={() => handleVerifyCodeforcesId(codeforcesId, setError, setPageNumber, setLoading)}>Next</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => handleVerifyAppScriptUrl(appScriptUrl, setError, setPageNumber, setLoading)}>Submit</Button>
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
