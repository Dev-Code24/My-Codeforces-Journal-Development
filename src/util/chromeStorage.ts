export function setGlobalVariablesToChromeStorage() {
  chrome.storage.local.set(
    {
      APP_SCRIPT_URL: window.APP_SCRIPT_URL,
      APPSCRIPT_VERIFIED: window.APPSCRIPT_VERIFIED,
      CODEFORCES_ID: window.CODEFORCES_ID,
      CODEFORCES_AVATAR_URL: window.CODEFORCES_AVATAR_URL,
      CODEFORCES_VERIFIED: window.CODEFORCES_VERIFIED,
      SETUP_COMPLETE: window.SETUP_COMPLETE,
    },
    () => {
      console.log("Global variables have been saved to Chrome local storage.");
    }
  );
}

export function getGlobalVariablesFromChromeStorage() {
  chrome.storage.local.get(
    ["APP_SCRIPT_URL", "APPSCRIPT_VERIFIED", "CODEFORCES_ID", "CODEFORCES_AVATAR_URL", "CODEFORCES_VERIFIED", "SETUP_COMPLETE"],
    (result) => {
      window.APP_SCRIPT_URL = result.APP_SCRIPT_URL || "";
      window.APPSCRIPT_VERIFIED = result.APPSCRIPT_VERIFIED || false;
      window.CODEFORCES_ID = result.CODEFORCES_ID || "";
      window.CODEFORCES_AVATAR_URL = result.CODEFORCES_AVATAR_URL || "";
      window.CODEFORCES_VERIFIED = result.CODEFORCES_VERIFIED || false;
      window.SETUP_COMPLETE = result.SETUP_COMPLETE || false;
    }
  );
}
