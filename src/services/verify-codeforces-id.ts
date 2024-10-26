import React from "react";
import { storage } from "../storage-fallback"; 
import { codeforcesUserFetchUrl } from "./request-urls";

type Params = (
  codeforcesId: string,
  setError: React.Dispatch<React.SetStateAction<boolean>>,
  setPageNumber: React.Dispatch<React.SetStateAction<number>> | undefined,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  closeModal: (() => void) | undefined
) => void;

export const handleVerifyCodeforcesId: Params = async (codeforcesId, setError, setPageNumber, setLoading, closeModal) => {
  // Use the storage utility to get the necessary variables
  storage.get(["CODEFORCES_VERIFIED", "CODEFORCES_ID", "CODEFORCES_AVATAR_URL"], async (result) => {
    const { CODEFORCES_VERIFIED } = result;

    // If Codeforces ID is already verified, proceed to next step
    if (CODEFORCES_VERIFIED) {
      if (setPageNumber) setPageNumber(3);
      return;
    }

    setLoading(true);
    // Comment the following in prod
    console.log(codeforcesId);

    const userId = codeforcesId.substring(31);
    const fetchUrl = codeforcesUserFetchUrl.replace("USERID", userId);

    try {
      const response = await fetch(fetchUrl);

      if (response.ok) {
        const data = await response.json();
        if (data?.status === "OK") {
          // Use storage utility to set the verified state and avatar URL
          storage.set(
            {
              CODEFORCES_VERIFIED: true,
              CODEFORCES_ID: userId,
              CODEFORCES_AVATAR_URL: data?.result[0]?.avatar,
            },
            () => {
              // Also update the global variables if necessary
              window.CODEFORCES_VERIFIED = true;
              window.CODEFORCES_ID = userId;
              window.CODEFORCES_AVATAR_URL = data?.result[0]?.avatar;
            }
          );

          setLoading(false);
          if (setPageNumber) setPageNumber(3);
        } else {
          setError(true);
        }
      } else {
        setError(true);
      }

      if (closeModal) closeModal();
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Error fetching Codeforces data:", error);

      if (closeModal) closeModal();
    }
  });
};
