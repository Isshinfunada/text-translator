const apiKey = '2b61b9af-64c2-f3d8-5d5c-f8556501723a:fx';

chrome.contextMenus.create({
  id: 'translate',
  title: 'Translate selected text',
  contexts: ['selection'],
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translate') {
    chrome.tabs.sendMessage(tab.id, { action: 'translate' });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translateText') {
    const text = request.text;
    translateText(text, (translatedText) => {
      sendResponse({ translatedText: translatedText });
    });
    return true; 
  }
});

function translateText(text, callback) {
  const url = `https://api-free.deepl.com/v2/translate`;
  const data = {
    auth_key: apiKey,
    source_lang: 'EN',
    target_lang: 'JA',
    text: text
  };

  const searchParams = new URLSearchParams(data);

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: searchParams.toString()
  })
    .then((response) => response.json())
    .then((data) => callback(data.translations[0].text))
    .catch((error) => console.error('Error:', error));
}
