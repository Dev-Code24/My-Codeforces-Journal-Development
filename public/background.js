// public/background.js

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
