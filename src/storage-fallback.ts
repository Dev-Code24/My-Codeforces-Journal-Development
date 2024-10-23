// Check for Chrome extension environment more reliably
const isChromeExtension = typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;

export const storage = {
  get: (keys: string[], callback: (result: { [key: string]: any }) => void) => {
    if (isChromeExtension) {
      try {
        // Check for errors and ensure the callback is executed in case of success
        chrome.storage.local.get(keys, (items) => {
          if (chrome.runtime.lastError) {
            console.error(`Error accessing Chrome storage: ${chrome.runtime.lastError.message}`);
          } else {
            console.warn("Using Chrome storage!");
            callback(items);
          }
        });
      } catch (error) {
        console.error("Error using Chrome storage local.get:", error);
        callback({}); // Fallback to an empty result in case of error
      }
    } else {
      // Use global variables as fallback during development
      const result: { [key: string]: any } = {};
      keys.forEach((key) => {
        switch (key) {
          case "APP_SCRIPT_URL":
            result.APP_SCRIPT_URL = window.APP_SCRIPT_URL;
            break;
          case "APPSCRIPT_VERIFIED":
            result.APPSCRIPT_VERIFIED = window.APPSCRIPT_VERIFIED;
            break;
          case "CODEFORCES_ID":
            result.CODEFORCES_ID = window.CODEFORCES_ID;
            break;
          case "CODEFORCES_AVATAR_URL":
            result.CODEFORCES_AVATAR_URL = window.CODEFORCES_AVATAR_URL;
            break;
          case "CODEFORCES_VERIFIED":
            result.CODEFORCES_VERIFIED = window.CODEFORCES_VERIFIED;
            break;
          case "SETUP_COMPLETE":
            result.SETUP_COMPLETE = window.SETUP_COMPLETE;
            break;
          default:
            result[key] = undefined;
        }
      });
      console.warn("Chrome storage not available. Using global variables as fallback for development.");
      callback(result);
    }
  },

  set: (items: { [key: string]: any }, callback?: () => void) => {
    if (isChromeExtension) {
      try {
        // Use Chrome storage local.set with error handling
        chrome.storage.local.set(items, () => {
          if (chrome.runtime.lastError) {
            console.error(`Error accessing Chrome storage: ${chrome.runtime.lastError.message}`);
          } else if (callback) {
            callback();
            console.warn("Using Chrome storage!");
          }
        });
      } catch (error) {
        console.error("Error using Chrome storage local.set:", error);
        if (callback) callback(); // Still call the callback even if an error occurs
      }
    } else {
      // Set global variables during development
      Object.keys(items).forEach((key) => {
        switch (key) {
          case "APP_SCRIPT_URL":
            window.APP_SCRIPT_URL = items[key];
            break;
          case "APPSCRIPT_VERIFIED":
            window.APPSCRIPT_VERIFIED = items[key];
            break;
          case "CODEFORCES_ID":
            window.CODEFORCES_ID = items[key];
            break;
          case "CODEFORCES_AVATAR_URL":
            window.CODEFORCES_AVATAR_URL = items[key];
            break;
          case "CODEFORCES_VERIFIED":
            window.CODEFORCES_VERIFIED = items[key];
            break;
          case "SETUP_COMPLETE":
            window.SETUP_COMPLETE = items[key];
            break;
          default:
            console.warn(`Unknown key: ${key}. Skipping assignment.`);
        }
      });
      console.warn("Chrome storage not available. Saving to global variables for development.");
      if (callback) callback();
    }
  },
};
