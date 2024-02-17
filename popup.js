document.addEventListener("DOMContentLoaded", function () {
  const addWebsiteButton = document.getElementById("addWebsite");
  addWebsiteButton.addEventListener("click", function () {
    const websiteUrl = document.getElementById("website").value;
    // Save website URL to storage (chrome.storage or browser.storage)
    // You can also add other form data here
  });

  const keyInput = document.getElementById("keyInput");
  const valueInput = document.getElementById("valueInput");
  const addButton = document.getElementById("addButton");
  const getFromFormButton = document.getElementById("getFromFormButton");
  const list = document.getElementById("list");


  // document.getElementsByTagName("form")[0].addEventListener("submit", function (event) {
  //   event.preventDefault(); // Prevent the default form submission behavior
  //   const formData = new FormData(event.target); // Get form data
  //   // Iterate through form data entries
  //   for (const [key, value] of formData.entries()) {
  //     insertPair(key, value);
  //   }
  //   displayPairs();
  // });


  getFromFormButton.addEventListener("click", function () {
    var inputs = document.getElementsByTagName("input");
    inputs = [...inputs, ...document.getElementsByTagName("textarea")];
    for (var i = 0; i < inputs.length; i++) {
      console.log(inputs[i]);
      inputElement = inputs[i];
      inputName = inputElement.getAttribute("name");
      inputId = inputElement.getAttribute("id");

      if (typeof inputName !== "undefined" && typeof inputId !== "undefined")
        insertPair(inputName || "#" + inputId, inputElement.value);
    }
    displayPairs();
  });

  addButton.addEventListener("click", function () {
    const key = keyInput.value;
    const value = valueInput.value;

    insertPair(key, value);
  });

  function displayPairs() {
    chrome.storage.local.get("pairs", function (result) {
      const pairs = result.pairs || {};
      list.innerHTML = "";
      for (const key in pairs) {
        const listItem = document.createElement("li");
        listItem.textContent = `${key}: ${pairs[key]}`;
        list.appendChild(listItem);
      }
    });
  }

  function insertPair(key, value) {
    // Save key-value pair to storage
    chrome.storage.local.get("pairs", function (result) {
      const pairs = result.pairs || {};
      pairs[key] = value;
      chrome.storage.local.set({ pairs });
      displayPairs();
    });
  }

  // Initial display
  displayPairs();
});
