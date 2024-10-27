// import { handleAddProblems } from "./services/add-problem";

const modalHTML = `
<div id="extensionModalBackground" style="display:none; position:fixed; inset:0; background-color:rgba(0, 0, 0, 0.7); z-index: 10000;">
  <div id="extensionModal" style="display:flex;flex-direction:column;position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:400px; padding:20px; background-color:white; border-radius:10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Remarks on the problem</h2>
    <textarea id="remarks" name="remarks" rows="5" style="flex-grow:1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px; resize: none;" placeholder="Were you able to solve the problem / Did your intuition work ?"></textarea>
    
    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Takeaway from the problem</h2>
    <textarea id="takeaways" name="takeaways" rows="10" style="flex-grow:1; padding: 10px; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 15px; resize: none;" placeholder="How did you solve the problem ? Explain your thought process."></textarea>
    
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
      <button id="cancelModalButton" style="background-color: #ccc; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Cancel</button>
      <button type="submit" id="submitModalButton" style="background:transparent; color: rgb(38 38 38 / 1); padding: 10px 20px; border: 1px solid; border-color: rgb(38 38 38 / 1); border-radius: 5px; cursor: pointer; font-weight: bold;">Submit</button>
    </div>
  </div>
</div>
`;

// Inject the modal HTML into the page
document.body.insertAdjacentHTML("beforeend", modalHTML);

// Add event listener to open the modal
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openModal") {
    document.getElementById("extensionModalBackground")!.style.display = "block";
  }
});

// Add event listener to close the modal when "Cancel" is clicked
document.getElementById("cancelModalButton")!.addEventListener("click", () => {
  document.getElementById("extensionModalBackground")!.style.display = "none";
});

// Handle form submission when "Submit" is clicked
document.getElementById("submitModalButton")!.addEventListener("click", async (event) => {
  event.preventDefault();

  const remarks = (document.getElementById("remarks") as HTMLTextAreaElement).value;
  const takeaways = (document.getElementById("takeaways") as HTMLTextAreaElement).value;
  const data = { remarks, takeaways };

  // Send the data to the background script
  chrome.runtime.sendMessage(
    { action: "submitProblem", data },
    (response) => {
      if (response.status === "success") {
        console.log("Submission complete:", response.result);
      } else {
        console.error("Error submitting problem:", response.error);
      }
    }
  );

  // Close the modal after submission
  document.getElementById("extensionModalBackground")!.style.display = "none";
});