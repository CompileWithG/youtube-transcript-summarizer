let summarizeBtn = null;
let sidebar = null;
const GEMINI_API_KEY = "AIzaSyAkfKhSoOOMkk-8IJc2OVLr9fQpcaVjKzs";

function createSidebarUI() {
  createSummarizeButton();
}

function createSummarizeButton() {
  if (document.getElementById("ytSummarizeBtn")) return;

  summarizeBtn = document.createElement("button");
  summarizeBtn.id = "ytSummarizeBtn";
  summarizeBtn.innerText = "📄 Summarize";
  summarizeBtn.onclick = handleSummarize;

  document.body.appendChild(summarizeBtn);
}

function handleSummarize() {
  const videoId = new URLSearchParams(window.location.search).get("v");
  if (!videoId) return alert("No video ID found");

  chrome.runtime.sendMessage({ type: "FETCH_TRANSCRIPT", videoId }, async (response) => {
    if (response.error) {
      alert("Error: " + response.error);
      return;
    }

    const fullText = response.transcript.map(t => t.text).join(" ");
    const summary = await generateGeminiSummary(fullText);
    showSidebar(fullText, summary);
  });
}

async function generateGeminiSummary(text) {
  try {
    const prompt = `Summarize this YouTube video Transcript: ${text}`;
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
    return summary;
  } catch (err) {
    console.error("Gemini summary error:", err);
    return "Error generating summary.";
  }
}

function showSidebar(transcriptText, summaryText) {
  if (document.getElementById("ytSmartSidebar")) return;

  sidebar = document.createElement("div");
  sidebar.id = "ytSmartSidebar";

  sidebar.innerHTML = `
    <div id="ytSidebarExpanded">
      <div id="ytSidebarHeader">
        <span>📄 Transcript & Summary</span>
        <button id="ytSidebarCloseBtn">✖</button>
      </div>
      <div id="ytSidebarContent">
        <h3>🧠 Summary</h3>
        <p>${summaryText.replace(/\n/g, "<br>")}</p>
        <hr>
        <h3>📄 Transcript</h3>
        ${transcriptText.split("\n").map(p => `<p>${p}</p>`).join("")}
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
window.addEventListener("yt-page-data-updated", createSidebarUI);
createSidebarUI();
