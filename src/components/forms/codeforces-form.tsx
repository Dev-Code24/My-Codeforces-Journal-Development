import React from "react";
import { checkCodeforcesUrl } from "../../util/utility";
import Loader from "../loader";
import Alert from "../alert";

interface Props {
  codeforcesId: string;
  setCodeforcesId: (value: string) => void;
  error: string;
  isLoading: boolean;
  onTryAgain: () => void;
}

const CodeforcesForm: React.FC<Props> = ({ codeforcesId, setCodeforcesId, error, isLoading, onTryAgain }) => {
  return (
    <div className="flex justify-center items-center h-full">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[190px]">
          <Loader>Verifying...</Loader>
        </div>
      ) : error.includes("NoError") ? (
        <div className="w-[355px] min-h-[190px] h-full flex flex-col">
          <label htmlFor="codeforcesId" className="font-semibold text-lg">
            Your Codeforces Id:
          </label>
          <textarea
            id="codeforcesId"
            value={codeforcesId}
            onChange={(e) => setCodeforcesId(e.target.value)}
            className="p-2 rounded-[14px] w-full mt-2 mb-1 flex-grow border border-primary-black bg-primary-light text-primary-black focus-visible:outline-none placeholder-primary-light"
            style={{ resize: "none" }}
            minLength={31}
          />
          {checkCodeforcesUrl(codeforcesId) !== true && <p className="m-2 text-danger-red">Put a valid codeforces URL!</p>}
        </div>
      ) : (
        <Alert title={error} description="Try Again !" onTryAgain={onTryAgain} />
      )}
    </div>
  );
};

export default CodeforcesForm;
