// Listen for form submission events on the page
document.addEventListener("submit", function (event) {
  // Extract form data from the submitted form
  const formData = {}; // Populate with form field values

  // Send the form data to the background script
  chrome.runtime.sendMessage({ action: "fillForm", data: formData });
});
