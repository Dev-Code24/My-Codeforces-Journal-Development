import React from "react";

type Params = (
  codeforcesId: string,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setPageNumber: React.Dispatch<React.SetStateAction<number>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => void;

export const handleVerifyCodeforcesId: Params = async (codeforcesId, setError, setPageNumber, setLoading) => {
  // Uncomment when building and publishing

  // chrome.storage.local.get(["CODEFORCES_VERIFIED", "codeforcesId"], (result) => {
  // if (result.CODEFORCES_VERIFIED) {
  //   setPageNumber(3);
  //   return;
  // }
  // Perform verification if not already verified

  if (window.CODEFORCES_VERIFIED) {
    setPageNumber(3);
    return;
  }
  setLoading(true);
  const userId = codeforcesId.substring(31);
  const fetchUrl = window.CODEFORCES_URL!.replace("USERID", userId);

  const response = await fetch(fetchUrl);

  setLoading(false);

  if (response.ok) {
    const data = await response.json();
    if (data?.status === "OK") {
      window.CODEFORCES_VERIFIED = true;
      setError(false);
      setPageNumber(3);
      // chrome.storage.local.set({ CODEFORCES_VERIFIED: true }, () => {
      //   setError(false);
      //   setPageNumber(3);
      // });
    } else {
      setError(true);
    }
  } else {
    setError(true);
  }
  // });
};
