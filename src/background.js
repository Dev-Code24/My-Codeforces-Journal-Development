// public/background.js
import { handleAddProblems } from "../src/services/add-problem";

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
});
