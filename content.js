function insertSidebarBox() {
  const existingBox = document.getElementById("yt-smart-sidebar");
  if (existingBox) return;

  const interval = setInterval(() => {
    const secondary = document.getElementById("secondary");
    if (secondary) {
      clearInterval(interval);

      const box = document.createElement("div");
      box.id = "yt-smart-sidebar";
      box.innerHTML = `
        <div class="yt-sidebar-header">
          📌 Tools
          <button id="yt-sidebar-toggle">Expand</button>
        </div>
        <div class="yt-sidebar-content">
          <p>This is your widget.</p>
        </div>
      `;

      secondary.prepend(box);

      const fullSidebar = document.createElement("div");
      fullSidebar.id = "yt-full-sidebar";
      fullSidebar.innerHTML = `
        <div class="yt-full-header">
          <button id="yt-sidebar-collapse">Collapse</button>
        </div>
        <div class="yt-full-content">
          <p id="yt-transcript-loading">⏳ Loading transcript...</p>
          <div id="yt-transcript-container" style="display: none;"></div>
        </div>
      `;
      document.body.appendChild(fullSidebar);

      document.getElementById("yt-sidebar-toggle").onclick = () => {
        fullSidebar.style.display = "flex";
        loadTranscript(); // <-- load transcript when opened
      };

      document.getElementById("yt-sidebar-collapse").onclick = () => {
        fullSidebar.style.display = "none";
      };
    }
  }, 500);
}

function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

function loadTranscript() {
  const videoId = getVideoId();
  if (!videoId) {
    document.getElementById("yt-transcript-loading").innerText = "❌ No video detected.";
    return;
  }

  // Construct transcript API URL
  const url = `https://video.google.com/timedtext?lang=en&v=${videoId}`;

  fetch(url)
    .then((res) => res.text())
    .then((xml) => {
      if (!xml.includes("<text")) {
        document.getElementById("yt-transcript-loading").innerText = "❌ Transcript not available.";
        return;
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const texts = xmlDoc.getElementsByTagName("text");

      const transcriptContainer = document.getElementById("yt-transcript-container");
      transcriptContainer.innerHTML = "";

      for (let i = 0; i < texts.length; i++) {
        const item = texts[i];
        let text = item.textContent.replace(/&#39;/g, "'").replace(/&quot;/g, '"');
        const div = document.createElement("div");
        div.className = "yt-transcript-line";
        div.innerText = text;
        transcriptContainer.appendChild(div);
      }

      document.getElementById("yt-transcript-loading").style.display = "none";
      transcriptContainer.style.display = "block";
    })
    .catch((err) => {
      document.getElementById("yt-transcript-loading").innerText = "⚠️ Error fetching transcript.";
      console.error(err);
    });
}

insertSidebarBox();
