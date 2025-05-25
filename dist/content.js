let r=null,o=null;const s="AIzaSyAkfKhSoOOMkk-8IJc2OVLr9fQpcaVjKzs";function m(){u()}function u(){document.getElementById("ytSummarizeBtn")||(r=document.createElement("button"),r.id="ytSummarizeBtn",r.innerText="📄 Summarize",r.onclick=l,document.body.appendChild(r))}function l(){const n=new URLSearchParams(window.location.search).get("v");if(!n)return alert("No video ID found");chrome.runtime.sendMessage({type:"FETCH_TRANSCRIPT",videoId:n},async t=>{if(t.error){alert("Error: "+t.error);return}const e=t.transcript.map(i=>i.text).join(" "),a=await y(e);p(e,a)})}async function y(n){var t,e,a,i,c;try{const d=`Summarize this YouTube video Transcript: ${n}`;return((c=(i=(a=(e=(t=(await(await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="+s,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:d}]}]})})).json()).candidates)==null?void 0:t[0])==null?void 0:e.content)==null?void 0:a.parts)==null?void 0:i[0])==null?void 0:c.text)||"No summary available."}catch(d){return console.error("Gemini summary error:",d),"Error generating summary."}}function p(n,t){document.getElementById("ytSmartSidebar")||(o=document.createElement("div"),o.id="ytSmartSidebar",o.innerHTML=`
    <div id="ytSidebarExpanded">
      <div id="ytSidebarHeader">
        <span>📄 Transcript & Summary</span>
        <button id="ytSidebarCloseBtn">✖</button>
      </div>
      <div id="ytSidebarContent">
        <h3>🧠 Summary</h3>
        <p>${t.replace(/\n/g,"<br>")}</p>
        <hr>
        <h3>📄 Transcript</h3>
        ${n.split(`
`).map(e=>`<p>${e}</p>`).join("")}
      </div>
    </div>
  `,document.body.appendChild(o),document.getElementById("ytSidebarCloseBtn").onclick=()=>{var e;(e=document.getElementById("ytSmartSidebar"))==null||e.remove()})}const S=new MutationObserver(()=>{window.location.href.includes("watch")&&!document.getElementById("ytSummarizeBtn")&&m()});S.observe(document.body,{childList:!0,subtree:!0});window.addEventListener("yt-page-data-updated",m);m();
