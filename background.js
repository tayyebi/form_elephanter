chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "fillForm") {
        console.log(message.data);
        // Logic to fill the form based on stored data
        // Use chrome.tabs API to interact with the current tab
    }
});
