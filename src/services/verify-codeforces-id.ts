import React from "react";

type Params = (
  codeforcesId: string,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setPageNumber: React.Dispatch<React.SetStateAction<number>> | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeModal: (() => void) | undefined
) => void;

export const handleVerifyCodeforcesId: Params = async (codeforcesId, setError, setPageNumber, setLoading, closeModal) => {
  // Uncomment when building and publishing

  // chrome.storage.local.get(["CODEFORCES_VERIFIED", "codeforcesId"], (result) => {
  // if (result.CODEFORCES_VERIFIED) {
  //   setPageNumber(3);
  //   return;
  // }
  // Perform verification if not already verified

  if (window.CODEFORCES_VERIFIED) {
    if (setPageNumber) setPageNumber(3);
    return;
  }
  setLoading(true);
  console.log(codeforcesId);

  const userId = codeforcesId.substring(31);
  const url = "https://codeforces.com/api/user.info?handles=USERID";
  const fetchUrl = url.replace("USERID", userId);

  const response = await fetch(fetchUrl);

  if (response.ok) {
    const data = await response.json();
    if (data?.status === "OK") {
      window.CODEFORCES_VERIFIED = true;
      window.CODEFORCES_ID = userId;
      window.CODEFORCES_AVATAR_URL = data?.result[0]?.avatar;
      setLoading(false);
      if (setPageNumber) setPageNumber(3);
      // chrome.storage.local.set({ CODEFORCES_VERIFIED: true }, () => {
      //   setPageNumber(3);
      // });
    } else {
      setError(true);
    }
    if (closeModal) closeModal();
  } else {
    setError(true);
    if (closeModal) closeModal();
  }
  // });
};
