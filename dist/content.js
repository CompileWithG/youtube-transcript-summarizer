let t=null,d=null;function r(){o()}function o(){document.getElementById("ytSummarizeBtn")||(t=document.createElement("button"),t.id="ytSummarizeBtn",t.innerText="📄 Summarize",t.onclick=m,document.body.appendChild(t))}function m(){const n=new URLSearchParams(window.location.search).get("v");if(!n)return alert("No video ID found");chrome.runtime.sendMessage({type:"FETCH_TRANSCRIPT",videoId:n},e=>{if(e.error){alert("Error: "+e.error);return}const i=e.transcript.map(a=>a.text).join(" ");u(i)})}function u(n){document.getElementById("ytSmartSidebar")||(d=document.createElement("div"),d.id="ytSmartSidebar",d.innerHTML=`
    <div id="ytSidebarExpanded">
      <div id="ytSidebarHeader">
        <span>📄 Transcript</span>
        <button id="ytSidebarCloseBtn">Close</button>
      </div>
      <div id="ytSidebarContent">
        ${n.split(`
`).map(e=>`<p>${e}</p>`).join("")}
      </div>
    </div>
  `,document.body.appendChild(d),document.getElementById("ytSidebarCloseBtn").onclick=()=>{var e;(e=document.getElementById("ytSmartSidebar"))==null||e.remove()})}const c=new MutationObserver(()=>{window.location.href.includes("watch")&&!document.getElementById("ytSummarizeBtn")&&r()});c.observe(document.body,{childList:!0,subtree:!0});window.addEventListener("yt-page-data-updated",r);r();
