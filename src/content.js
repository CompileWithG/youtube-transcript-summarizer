function createSidebarUI() {
  const sidebarContainer = document.createElement("div");
  sidebarContainer.id = "ytSmartSidebar";
  sidebarContainer.innerHTML = `
    <div id="ytSidebarCollapsed">
      <button id="ytExpandBtn">📜 Expand</button>
    </div>
    <div id="ytSidebarExpanded" style="display: none;">
      <div id="ytSidebarHeader">
        <span>📜 Transcript</span>
        <button id="ytCollapseBtn">Collapse</button>
      </div>
      <div id="ytSidebarContent">Loading...</div>
    </div>
  `;
  document.body.appendChild(sidebarContainer);

  document.getElementById("ytExpandBtn").onclick = () => {
    document.getElementById("ytSidebarCollapsed").style.display = "none";
    document.getElementById("ytSidebarExpanded").style.display = "block";
    fetchTranscript();
  };

  document.getElementById("ytCollapseBtn").onclick = () => {
    document.getElementById("ytSidebarExpanded").style.display = "none";
    document.getElementById("ytSidebarCollapsed").style.display = "flex";
  };
}

function fetchTranscript() {
  const videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId) {
    document.getElementById("ytSidebarContent").innerText = "No video ID found.";
    return;
  }

  chrome.runtime.sendMessage({ type: "FETCH_TRANSCRIPT", videoId }, (response) => {
    const contentDiv = document.getElementById("ytSidebarContent");
    if (response.error) {
      contentDiv.innerText = "Error fetching transcript: " + response.error;
      return;
    }
    contentDiv.innerHTML = response.transcript.map(t => `<p>${t.text}</p>`).join("");
  });
}

createSidebarUI();
