function replaceSelectedText(replacementText) {
  const sel = window.getSelection();
  if (sel.rangeCount) {
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(replacementText));
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      chrome.runtime.sendMessage(
        { action: 'translateText', text: selectedText },
        (response) => {
          replaceSelectedText(response.translatedText);
        }
      );
    }
  }
});
