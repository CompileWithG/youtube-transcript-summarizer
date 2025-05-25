function i(){const e=document.createElement("div");e.id="ytSmartSidebar",e.innerHTML=`
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
  `,document.body.appendChild(e),document.getElementById("ytExpandBtn").onclick=()=>{document.getElementById("ytSidebarCollapsed").style.display="none",document.getElementById("ytSidebarExpanded").style.display="block",a()},document.getElementById("ytCollapseBtn").onclick=()=>{document.getElementById("ytSidebarExpanded").style.display="none",document.getElementById("ytSidebarCollapsed").style.display="flex"}}function a(){const e=new URLSearchParams(window.location.search).get("v");if(!e){document.getElementById("ytSidebarContent").innerText="No video ID found.";return}chrome.runtime.sendMessage({type:"FETCH_TRANSCRIPT",videoId:e},t=>{const n=document.getElementById("ytSidebarContent");if(t.error){n.innerText="Error fetching transcript: "+t.error;return}n.innerHTML=t.transcript.map(d=>`<p>${d.text}</p>`).join("")})}i();
