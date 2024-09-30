# My Codeforces Journal

**My Codeforces Journal** is a Chrome extension that helps Codeforces users track the problems they've solved. With just a click, the extension stores the details of the current problem to a Google Spreadsheet that the user has connected. This makes it easy to maintain a personal log of problems solved over time.

## Features

- **One-click Storage**: Save the current Codeforces problem you’ve solved with a single click.
- **Spreadsheet Integration**: Link your own Google Spreadsheet to store and organize problems in a format that suits you.
- **Problem Details Captured**: The extension stores key information such as problem URL, problem name, and problem rating.

## Getting Started

### Prerequisites

Before you can use the extension, make sure you have the following:

- A Google Spreadsheet where the problems will be stored.
- The Codeforces Journal Chrome extension installed and authorized to access your spreadsheet.

### Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the folder where the project files are saved.
5. The extension should now be visible in your Chrome toolbar.

### Spreadsheet Setup

1. Create a new Google Spreadsheet.
2. Make sure the spreadsheet has appropriate columns for storing the problem details (e.g., Problem Name, Problem URL, Rating, etc.).
3. Follow the extension’s instructions to connect your spreadsheet via Google Sheets API.

## Usage

1. Open any Codeforces problem page.
2. Once you’ve solved the problem, click on the **My Codeforces Journal** extension icon.
3. The problem details will be automatically saved to the connected spreadsheet.

## Permissions

This extension requires the following permissions:

- **Active Tab**: To access the URL of the current tab when saving the problem.
- **Storage**: To store your connected spreadsheet details.
- **Scripting**: To run JavaScript
