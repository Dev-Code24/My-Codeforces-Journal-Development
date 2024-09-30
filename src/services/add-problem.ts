// const handleAddProblem = (spreadsheetUrl, problemDetails) => {
//   fetch(spreadsheetUrl, {
//     method: "POST",
//     body: JSON.stringify({
//       action: "addProblem",
//       ...problemDetails,
//     }),
//     headers: { "Content-Type": "application/json" },
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.status === "success") {
//         alert("Problem data added successfully.");
//       } else {
//         alert("Error adding problem data: " + data.message);
//       }
//     })
//     .catch((error) => console.error("Request failed:", error));
// };
