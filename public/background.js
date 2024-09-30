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
