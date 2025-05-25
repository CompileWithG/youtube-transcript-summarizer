let summarizeBtn = null;
let sidebar = null;

function createSidebarUI() {
  createSummarizeButton();
}

function createSummarizeButton() {
  if (document.getElementById("ytSummarizeBtn")) return;

  summarizeBtn = document.createElement("button");
  summarizeBtn.id = "ytSummarizeBtn";
  summarizeBtn.innerText = "📄 Summarize";
  summarizeBtn.onclick = handleSummarize;

  // Append to body and position it absolutely
  document.body.appendChild(summarizeBtn);
}

function handleSummarize() {
  const videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId) return alert("No video ID found");

  chrome.runtime.sendMessage({ type: "FETCH_TRANSCRIPT", videoId }, (response) => {
    if (response.error) {
      alert("Error: " + response.error);
      return;
    }

    const fullText = response.transcript.map(t => t.text).join(" ");
    showSidebar(fullText);
  });
}

function showSidebar(text) {
  if (document.getElementById("ytSmartSidebar")) return;

  sidebar = document.createElement("div");
  sidebar.id = "ytSmartSidebar";

  sidebar.innerHTML = `
    <div id="ytSidebarExpanded">
      <div id="ytSidebarHeader">
        <span>📄 Transcript</span>
        <button id="ytSidebarCloseBtn">Close</button>
      </div>
      <div id="ytSidebarContent">
        ${text.split("\n").map(p => `<p>${p}</p>`).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(sidebar);

  document.getElementById("ytSidebarCloseBtn").onclick = () => {
    document.getElementById("ytSmartSidebar")?.remove();
  };
}

// Watch for dynamic page changes and re-add the button
const observer = new MutationObserver(() => {
  if (window.location.href.includes("watch") && !document.getElementById("ytSummarizeBtn")) {
    createSidebarUI();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Ensure button is injected when YouTube route changes
window.addEventListener("yt-page-data-updated", createSidebarUI);
createSidebarUI();
