// https://script.google.com/macros/s/AKfycbz7W2YZN2_gSvvjcZBn954J57smt5n4XWKAZDEH-M877Cmfpj4FbRbY8kL8yCCs0SJbpw/exec
import React from "react";
import Button from "../../ui/button";
import { checkAppScriptUrl } from "../../util/utility";
import Loader from "../loader";
import Alert from "../alert";

interface Props {
  pageNumber: number;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  error: boolean;
  isLoading: boolean;
  onTryAgain: () => void;
}

const SpreadsheetForm: React.FC<Props> = ({ pageNumber, url, setUrl, error, isLoading, onTryAgain }) => {
  return (
    <div className="flex justify-center items-center h-full">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader>Verifying...</Loader>
        </div>
      ) : !error && pageNumber === 3 ? (
        <div className="w-[355px] h-full flex flex-col">
          <label htmlFor="codeforcesId" className="font-semibold text-lg">
            Your Spreadsheet's AppScript Url:
          </label>
          <textarea
            id="codeforcesId"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="p-2 rounded-[14px] w-full mt-2 mb-1 flex-grow border border-primary-black bg-primary-light text-primary-black focus-visible:outline-none placeholder-primary-light"
            style={{ resize: "none" }}
            minLength={31}
          />
          {checkAppScriptUrl(url) !== true && <p className="m-2 text-danger-red">Put a valid Spreadsheet's AppScript URL!</p>}
        </div>
      ) : (
        <Alert title="APPSCRIPT NOT FOUND!" description="Try Again!" onTryAgain={onTryAgain} />
      )}
    </div>
  );
};

export default SpreadsheetForm;
