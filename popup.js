document.addEventListener("DOMContentLoaded", function () {

  const keyInput = document.getElementById("keyInput");
  const valueInput = document.getElementById("valueInput");
  const addButton = document.getElementById("addButton");
  const list = document.getElementById("list");

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

        // Create a remove button for each pair
        const removeButton = document.createElement("button");
        removeButton.textContent = "حذف";
        removeButton.addEventListener("click", function () {
          // Remove the key-value pair from storage
          delete pairs[key];
          chrome.storage.local.set({ pairs });
          displayPairs(); // Refresh the list
        });

        // Create a track button for each pair
        const trackButton = document.createElement("button");
        trackButton.textContent = "رهگیری";
        trackButton.addEventListener("click", function () {
          const value = pairs[key]; // Retrieve the value associated with the key
          // Open the tracking website with the value as a query parameter
          const trackingUrl = `https://tracking.post.ir/`;
          window.open(trackingUrl, "_blank");

          // Optionally, insert the value into the text box (if the tracking website has one)
          const trackingCodeInput = getElementByXpath("//html[1]/body[1]/div[1]");
          if (trackingCodeInput) {
            trackingCodeInput.value = value;
            trackingCodeInput.form.submit();
          }
        });

        listItem.appendChild(removeButton);
        listItem.appendChild(trackButton);
        const textCnt = document.createElement("span");
        textCnt.textContent = `${key}`;
        listItem.appendChild(textCnt);
        list.appendChild(listItem);
      }
    });
  }

  function getElementByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
