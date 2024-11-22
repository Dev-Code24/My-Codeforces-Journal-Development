import axios from "axios";
import { storage } from "../storage-fallback";
import { appscriptFetchUrl } from "./request-urls";

type Params = (
  appScriptUrl: string,
  setError: (param: string) => void,
  setPageNumber: (param: number) => void | undefined,
  setLoading: (param: boolean) => void,
  closeModal: (() => void) | undefined
) => void;

const handleVerifyAppScriptUrl: Params = async (appScriptUrl, setError, setPageNumber, setLoading, closeModal) => {
  storage.get(["APP_SCRIPT_URL", "APPSCRIPT_VERIFIED", "SETUP_COMPLETE"], async (result) => {
    const { APPSCRIPT_VERIFIED } = result;

    if (APPSCRIPT_VERIFIED) {
      if (setPageNumber) setPageNumber(4);
      return;
    }

    setLoading(true);

    try {
      const SECRET_HASH = appScriptUrl.split("/")[5];
      const fetchUrl = appscriptFetchUrl.replace("SECRET_HASH", SECRET_HASH).concat("?action=initialize");
      storage.set(
        {
          APP_SCRIPT_URL: appScriptUrl,
        },
        () => {
          window.APP_SCRIPT_URL = appScriptUrl;
        }
      );

      const response = await axios.post(
        fetchUrl,
        { action: "initialize" },
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        if (data.status === "success") {
          // Use fallback storage for setting variables
          storage.set(
            {
              APPSCRIPT_VERIFIED: true,
              SETUP_COMPLETE: true,
            },
            () => {
              // Also update window globals if necessary
              window.APPSCRIPT_VERIFIED = true;
              window.SETUP_COMPLETE = true;
            }
          );

          setLoading(false);
          if (setPageNumber) setPageNumber(4);
          console.log("Sheet initialized successfully:", data.message);
        } else {
          setError("Error! " + data?.message);
          console.error("Initialization failed:", data.message);
        }
      } else {
        setError("Error intializing Spreadsheet!");
        console.error("Error during initialization:", response.statusText);
      }

      if (closeModal) closeModal();
    } catch (error) {
      setLoading(false);
      setError("Error! Something bad happened!");
      if (closeModal) closeModal();
      console.error("Request failed:", error);
    }
  });
};

if (DEV_OR_PROD === "development" && DEV_APPSCRIPT_URL !== " ") {
  const dummySetError = (param: string) => {};
  const dummySetPageNumber = (param: number) => {};
  const dummySetLoading = (param: boolean) => {};
  const dummyCloseModal = () => {};
  handleVerifyAppScriptUrl(DEV_APPSCRIPT_URL!, dummySetError, dummySetPageNumber, dummySetLoading, dummyCloseModal);
}

export { handleVerifyAppScriptUrl };
