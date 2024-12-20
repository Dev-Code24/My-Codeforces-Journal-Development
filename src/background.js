import { handleAddProblems } from "../src/services/add-problem";
import { handleUpdateProblems } from "../src/services/update-problem";
import { appscriptFetchUrl } from "./services/request-urls";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed.");
});

// Reload the extension when a message is received
chrome.runtime.onMessage.addListener((message) => {
  if (message === "reload-extension") {
    chrome.runtime.reload();
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log("Tab URL changed to:", changeInfo.url);
  }
});

chrome.action.onClicked.addListener((tab) => {
  // Send a message to the content script to open the modal
  chrome.tabs.sendMessage(tab.id, { action: "openModal" });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "submitProblem") {
    handleAddProblems(request.data, (message, success) => {
      if (success) {
        sendResponse({ status: "success", result: message });
      } else {
        sendResponse({ status: "error", error: message });
      }
    });

    return true; // Keep the message channel open for async response
  }
  if (request.action === "updateProblem") {
    handleUpdateProblems(request.data, (message, success) => {
      if (success) {
        sendResponse({ status: "success", result: message });
      } else {
        sendResponse({ status: "error", error: message });
      }
    });

    return true; // Keep the message channel open for async response
  }
});

// Check if the problem is in the spreadsheet
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.url.match(/^https:\/\/codeforces\.com\/(contest\/\d+\/problem\/[A-Z]|problemset\/problem\/\d+\/[A-Z])$/)) {
    console.log("Codeforces problem page detected:", tab.url);

    // Extract problem name or ID from the URL
    const url_split = tab.url.split("/");
    const problem = [url_split[url_split.length - 1], url_split[url_split.length - 2], url_split[url_split.length - 3]].sort();
    const problemName = `Problem${problem[0]}${problem[1]}`;

    // Retrieve AppScript URL from Chrome storage
    chrome.storage.local.get(["APP_SCRIPT_URL"], (result) => {
      const appScriptUrl = result.APP_SCRIPT_URL;
      if (!appScriptUrl || appScriptUrl.trim() === "") {
        console.warn("AppScript URL not found or is empty. Skipping check.");
        return; // return if AppScript URL is not available
      }

      const SECRET_HASH = appScriptUrl.split("/")[5];
      const fetchUrl = appscriptFetchUrl.replace("SECRET_HASH", SECRET_HASH);

      // Check if the problem exists
      fetch(`${fetchUrl}?problemName=${problemName}`)
        .then((response) => response.json())
        .then((data) => {
          // Send the result to the content script
          chrome.tabs.sendMessage(tabId, { action: "prefillModal", data });
          console.log("Problem was previously added:" + data?.status);
        })
        .catch((error) => console.error("Error checking problem:", error));
    });
  }
});
