import { YoutubeTranscript } from 'youtube-transcript';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_TRANSCRIPT") {
    YoutubeTranscript.fetchTranscript(request.videoId)
      .then((transcript) => sendResponse({ transcript }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});
