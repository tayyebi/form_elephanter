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
          const value = pairs[key];

          copyTextToClipboard(value);
          showToast();

          // Check if the current tab has the same URL as the tracking website
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const currentTabUrl = tabs[0].url;
            const trackingUrl = "https://tracking.post.ir";

            if (currentTabUrl == trackingUrl) {

              window.open(trackingUrl, "_blank");

            }

          });

          // Optionally, insert the value into the text box (if the tracking website has one)
          const trackingCodeInput = getElementByXpath("/html/body/form/div[6]/div/div/div[1]/div[1]/div/input");
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


  function showToast() {
    const toast = document.getElementById("toast");
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1000); // Hide after 3 seconds
  }

  // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      console.log('Async: Copying to clipboard was successful!');
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

  // Initial display
  displayPairs();
});
