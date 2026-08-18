(()=>{
  const SHARED_DEVICE_ID='1f5fed11-afc5-4b9b-9a14-785950290a3d';
  const originalFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(/\/(watch-rules|scan-now|scan-latest)(?:\?|$)/.test(url)){
      const headers=new Headers(init.headers||(input instanceof Request?input.headers:undefined));
      headers.set('x-device-id',SHARED_DEVICE_ID);
      init={...init,headers};
    }
    return originalFetch(input,init);
  };

  // Shared page UI refinements.
  const style=document.createElement('style');
  style.textContent=`
    .vehicleFilters{
      display:grid !important;
      grid-template-columns:repeat(3,minmax(0,1fr)) !important;
      gap:8px !important;
      overflow:visible !important;
      padding:10px 0 2px !important;
    }
    .vehicleFilter{
      width:100% !important;
      min-width:0 !important;
      min-height:54px;
      display:flex !important;
      flex-direction:column;
      justify-content:center;
      padding:8px 8px !important;
      border-radius:13px !important;
      text-align:left;
    }
    .vehicleFilterTitle{
      width:100%;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      font-size:11px !important;
      line-height:1.25;
    }
    .vehicleFilterMeta{
      margin-top:4px !important;
      font-size:9px !important;
      line-height:1.2;
      white-space:nowrap;
    }
    @media (max-width:380px){
      .vehicleFilters{gap:6px !important;}
      .vehicleFilter{padding:7px 7px !important;}
      .vehicleFilterTitle{font-size:10.5px !important;}
      .vehicleFilterMeta{font-size:8.5px !important;}
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('DOMContentLoaded',()=>{
    const count=document.getElementById('countText');
    if(count&&!document.getElementById('sharedHint')){
      const hint=document.createElement('div');
      hint.id='sharedHint';
      hint.textContent='共享关注 · 所有人看到同一列表';
      hint.style.cssText='font-size:11px;color:#737d8e;margin-top:3px';
      count.insertAdjacentElement('afterend',hint);
    }
  });
})();
