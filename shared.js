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

  const style=document.createElement('style');
  style.textContent=`
    .matchImages:not(.one){
      grid-template-columns:repeat(2,minmax(0,1fr)) !important;
      gap:2px !important;
      overflow:hidden;
    }
    .matchImages:not(.one) img{
      width:100% !important;
      height:auto !important;
      aspect-ratio:16 / 9;
      object-fit:cover !important;
      object-position:center center !important;
      transform:none !important;
      display:block;
    }
    .matchImages.one img{
      width:100% !important;
      height:auto !important;
      aspect-ratio:16 / 9;
      object-fit:cover !important;
      object-position:center center !important;
      transform:none !important;
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
