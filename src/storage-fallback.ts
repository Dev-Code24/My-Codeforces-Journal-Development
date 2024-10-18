const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

export const storage = {
  get: (keys: string[], callback: (result: { [key: string]: any }) => void) => {
    if (isChromeExtension) {
      chrome.storage.local.get(keys, callback);
    } else {
      // Use global variables as fallback during development
      const result: { [key: string]: any } = {};
      keys.forEach((key) => {
        switch (key) {
          case 'APP_SCRIPT_URL':
            result.APP_SCRIPT_URL = window.APP_SCRIPT_URL;
            break;
          case 'APPSCRIPT_VERIFIED':
            result.APPSCRIPT_VERIFIED = window.APPSCRIPT_VERIFIED;
            break;
          case 'CODEFORCES_ID':
            result.CODEFORCES_ID = window.CODEFORCES_ID;
            break;
          case 'CODEFORCES_AVATAR_URL':
            result.CODEFORCES_AVATAR_URL = window.CODEFORCES_AVATAR_URL;
            break;
          case 'CODEFORCES_VERIFIED':
            result.CODEFORCES_VERIFIED = window.CODEFORCES_VERIFIED;
            break;
          case 'SETUP_COMPLETE':
            result.SETUP_COMPLETE = window.SETUP_COMPLETE;
            break;
          default:
            result[key] = undefined;
        }
      });
      console.warn('Chrome storage not available. Using global variables as fallback for development.');
      callback(result);
    }
  },
  set: (items: { [key: string]: any }, callback?: () => void) => {
    if (isChromeExtension) {
      chrome.storage.local.set(items, callback!);
    } else {
      // Set global variables during development
      Object.keys(items).forEach((key) => {
        switch (key) {
          case 'APP_SCRIPT_URL':
            window.APP_SCRIPT_URL = items[key];
            break;
          case 'APPSCRIPT_VERIFIED':
            window.APPSCRIPT_VERIFIED = items[key];
            break;
          case 'CODEFORCES_ID':
            window.CODEFORCES_ID = items[key];
            break;
          case 'CODEFORCES_AVATAR_URL':
            window.CODEFORCES_AVATAR_URL = items[key];
            break;
          case 'CODEFORCES_VERIFIED':
            window.CODEFORCES_VERIFIED = items[key];
            break;
          case 'SETUP_COMPLETE':
            window.SETUP_COMPLETE = items[key];
            break;
          default:
            console.warn(`Unknown key: ${key}. Skipping assignment.`);
        }
      });
      console.warn('Chrome storage not available. Saving to global variables for development.');
      if (callback) callback();
    }
  }
};
