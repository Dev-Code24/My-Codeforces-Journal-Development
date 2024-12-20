const modalHTML = `
<style>
  /* Loader Styles */
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13px;
    height: 13px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<div id="extensionModalBackground" style="display:none; position:fixed; inset:0; background-color:rgba(0, 0, 0, 0.7); z-index: 10000;">
  <div id="extensionModal" style="display:flex;flex-direction:column;position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:400px; padding:20px; background-color:white; border-radius:10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
    
    <!-- Message Area -->
    <div id="modalMessage" style="font-size: 16px; color: #333; margin-bottom: 10px;text-align:center;"></div>

    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Status</h2>
    <textarea id="status" name="status" rows="2" style="flex-grow:1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px; resize: none;" placeholder="Did you solve the problem yourself, or saw a solution ?"></textarea>
    
    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Remarks on the problem</h2>
    <textarea id="remarks" name="remarks" rows="5" style="flex-grow:1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px; resize: none;" placeholder="Were you able to solve the problem / Did your intuition work ?"></textarea>
    
    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Takeaway from the problem</h2>
    <textarea id="takeaways" name="takeaways" rows="10" style="flex-grow:1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px; resize: none;" placeholder="How did you solve the problem ? Explain your thought process."></textarea>
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button id="cancelModalButton" style="background-color: #ccc; padding: 6px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Close</button>
      <button type="submit" id="submitModalButton" style="background:transparent; color: rgb(38 38 38 / 1); padding: 6px 20px; border: 1px solid; border-color: rgb(38 38 38 / 1); border-radius: 5px; cursor: pointer; font-weight: bold; position: relative;">
        <span id="submitButtonText">Submit</span>
        <div id="loadingSpinnerWrapper" class="spinnerWrapper" style="display: none;width: 100%;">
        <div id="loadingSpinner" class="loader" style="display: none; position: relative;"></div>
        </div>
      </button>
    </div>
  </div>
</div>
`;

// Inject the modal HTML into the page
document.body.insertAdjacentHTML("beforeend", modalHTML);
let _action: string;

// Add event listener to open the modal and prefill it if data exists
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openModal") {
    document.getElementById("extensionModalBackground")!.style.display = "block";
    document.getElementById("modalMessage")!.textContent = "";
  }

  if (request.action === "prefillModal") {
    const { data } = request;

    const submitButtonText = document.getElementById("submitButtonText") as HTMLElement;
    if (data.status === "success" && data.problem) {
      _action = "updateProblem";
      if (submitButtonText) {
        submitButtonText.innerText = "Edit";
      }
      prefillModal(data.problem);
    } else {
      if (submitButtonText) {
        submitButtonText.innerText = "Submit";
      }
    }
  }
});

// Prefill the modal with existing data
function prefillModal(problem: { status: string; remarks: string; takeaways: string }) {
  (document.getElementById("status") as HTMLTextAreaElement).value = problem.status;
  (document.getElementById("remarks") as HTMLTextAreaElement).value = problem.remarks;
  (document.getElementById("takeaways") as HTMLTextAreaElement).value = problem.takeaways;

  document.getElementById("extensionModalBackground")!.style.display = "block";
}

// Add event listener to close the modal when "Cancel" is clicked
document.getElementById("cancelModalButton")!.addEventListener("click", () => {
  document.getElementById("extensionModalBackground")!.style.display = "none";
});

// Handle form submission when "Submit" is clicked
document.getElementById("submitModalButton")!.addEventListener("click", async (event) => {
  event.preventDefault();

  const submitButtonText = document.getElementById("submitButtonText")!;
  const loadingSpinner = document.getElementById("loadingSpinner")!;
  const loadingSpinnerWrapper = document.getElementById("loadingSpinnerWrapper")!;
  submitButtonText.style.display = "none";
  loadingSpinnerWrapper.style.display = "inline-block";
  loadingSpinner.style.display = "inline-block";

  const status = (document.getElementById("status") as HTMLTextAreaElement).value;
  const remarks = (document.getElementById("remarks") as HTMLTextAreaElement).value;
  const takeaways = (document.getElementById("takeaways") as HTMLTextAreaElement).value;
  const data = { remarks, takeaways, status };

  if (!_action) {
    _action = "submitProblem";
  }

  // Send the data to the background script and await response
  chrome.runtime.sendMessage({ action: _action, data }, (response) => {
    // Hide loading spinner and show submit text again
    submitButtonText.style.display = "inline";
    loadingSpinnerWrapper.style.display = "none";
    loadingSpinner.style.display = "none";

    const modalMessage = document.getElementById("modalMessage")!;
    if (response.status === "success") {
      modalMessage.textContent = "Submission successful!";
      modalMessage.style.color = "green";
    } else {
      modalMessage.textContent = `Error: ${response.error}`;
      modalMessage.style.color = "red";
    }
  });
});
