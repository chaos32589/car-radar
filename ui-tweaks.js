(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .matchBody{padding:10px 12px 11px !important}
    .matchTitle{line-height:1.18 !important;margin:0 !important}
    .metaGrid{margin-top:7px !important;gap:6px !important}
    .metaItem{grid-template-rows:11px 22px !important;row-gap:2px !important}
    .metaLabel{line-height:11px !important;height:11px !important}
    .metaValue{height:22px !important;line-height:22px !important}
    .metaItem.price .metaValue{height:22px !important;line-height:22px !important}
    .preparingBadge{display:inline-flex;align-items:center;margin-left:7px;padding:2px 6px;border-radius:999px;background:rgba(255,138,50,.12);border:1px solid rgba(255,138,50,.42);color:#ff9b52;font-size:9px;font-weight:750;line-height:1.25;vertical-align:2px;white-space:nowrap}
    body.light-theme .preparingBadge{background:#fff3e8;border-color:#ffc28f;color:#d96a18}
    @media(max-width:520px){
      .matchBody{padding:9px 11px 10px !important}
      .metaGrid{margin-top:6px !important;gap:5px !important}
      .metaItem{grid-template-rows:10px 21px !important;row-gap:2px !important}
      .metaLabel{line-height:10px !important;height:10px !important}
      .metaValue,.metaItem.price .metaValue{height:21px !important;line-height:21px !important}
      .preparingBadge{margin-left:6px;padding:2px 5px;font-size:8.5px}
    }
  `;
  document.head.appendChild(style);

  const preparingIds=new Set();
  function absorb(data){
    const list=data?.matches||data?.detail?.matches||[];
    for(const item of list){
      const id=String(item?.id||'');
      if(!id) continue;
      if(item?.sale_status==='preparing') preparingIds.add(id); else preparingIds.delete(id);
    }
    mark();
  }
  function mark(){
    document.querySelectorAll('.matchCard').forEach(card=>{
      const href=card.getAttribute('href')||'';
      const id=href.match(/\/car\/(\d+)/)?.[1];
      const title=card.querySelector('.matchTitle');
      if(!title||!id) return;
      let badge=title.querySelector('.preparingBadge');
      if(preparingIds.has(id)){
        if(!badge){badge=document.createElement('span');badge.className='preparingBadge';badge.textContent='整备中';title.appendChild(badge)}
      }else badge?.remove();
    });
  }

  const originalFetch=window.fetch.bind(window);
  window.fetch=async(input,init)=>{
    const response=await originalFetch(input,init);
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(/\/(scan-now|scan-latest)(?:\?|$)/.test(url)){
      response.clone().json().then(absorb).catch(()=>{});
    }
    return response;
  };

  new MutationObserver(mark).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('DOMContentLoaded',()=>{
    mark();
    fetch('https://yhudaquqbvqmhyjyygrh.supabase.co/functions/v1/scan-latest').then(r=>r.json()).then(absorb).catch(()=>{});
  });
})();
