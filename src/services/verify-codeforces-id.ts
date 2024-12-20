import React from "react";
import { storage } from "../storage-fallback";
import { codeforcesUserFetchUrl } from "./request-urls";

type Params = (
  codeforcesId: string,
  setError: (param: string) => void,
  setPageNumber: ((param: number) => void) | undefined,
  setLoading: (param: boolean) => void,
  closeModal: (() => void) | undefined
) => void;

const handleVerifyCodeforcesId: Params = async (codeforcesId, setError, setPageNumber, setLoading, closeModal) => {
  // Use the storage utility to get the necessary variables
  storage.get(["CODEFORCES_VERIFIED", "CODEFORCES_ID", "CODEFORCES_AVATAR_URL"], async (result) => {
    const { CODEFORCES_VERIFIED } = result;

    // If Codeforces ID is already verified, proceed to next step
    if (CODEFORCES_VERIFIED) {
      if (setPageNumber) setPageNumber(3);
      return;
    }

    setLoading(true);

    if (DEV_OR_PROD === "development") console.log(codeforcesId);

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
          setError("Error! Try Again: " + data?.comment);
          setLoading(false);
        }
      } else {
        setError("Error! Something bad happened!");
        setLoading(false);
      }

      if (closeModal) closeModal();
    } catch (error) {
      setLoading(false);
      setError("Error fetching Codeforces data");
      console.error("Error fetching Codeforces data:", error);

      if (closeModal) closeModal();
    }
  });
};

if (DEV_OR_PROD === "development" && DEV_CODEFORCES_ID !== " ") {
  const dummySetError = (param: string) => {};
  const dummySetPageNumber = (param: number) => {};
  const dummySetLoading = (param: boolean) => {};
  const dummyCloseModal = () => {};
  handleVerifyCodeforcesId(DEV_CODEFORCES_ID!, dummySetError, dummySetPageNumber, dummySetLoading, dummyCloseModal);
}

export { handleVerifyCodeforcesId };
