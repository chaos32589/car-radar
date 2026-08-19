(()=>{
  const SHARED_DEVICE_ID='1f5fed11-afc5-4b9b-9a14-785950290a3d';
  const originalFetch=window.fetch.bind(window);
  window.fetch=(input,init={})=>{
    const url=typeof input==='string'?input:(input&&input.url)||'';
    if(/\/(watch-rules|scan-now|scan-latest)(?:\?|$)/.test(url)){
      const headers=new Headers(init.headers||(input instanceof Request?input.headers:undefined));
      headers.set('x-device-id',SHARED_DEVICE_ID);init={...init,headers};
    }
    return originalFetch(input,init);
  };
  const style=document.createElement('style');style.textContent=`
    .matchImages:not(.one){grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:2px !important;overflow:hidden}.matchImages:not(.one) img,.matchImages.one img{width:100% !important;height:auto !important;aspect-ratio:16/9;object-fit:cover !important;object-position:center !important;transform:none !important;display:block}.vehicleFilterTitle{font-size:13px !important}.vehicleFilterMeta{font-size:10.5px !important}
    #statusActions{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}.hero #statusActions .status{margin-top:0 !important;height:40px}.hero #allCarsLink{display:inline-flex;align-items:center;justify-content:center;gap:6px;margin:0 !important;height:40px;padding:0 13px;border:1px solid #293242;border-radius:999px;background:#121923;color:#aab3c5;text-decoration:none;font-size:12px;line-height:1;white-space:nowrap}#allCarsLink svg{width:14px;height:14px;display:block;flex:none}#allCarsLink:active{background:#18212d;color:#fff}
    #ruleModalBackdrop{display:none;position:fixed;inset:0;z-index:9998;background:rgba(3,6,10,.72);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px)}#ruleModalBackdrop.open{display:block}
    #formCard.formCard{position:fixed !important;z-index:9999 !important;left:50% !important;top:50% !important;transform:translate(-50%,-50%) scale(.97);width:min(620px,calc(100vw - 28px)) !important;max-height:calc(100dvh - 40px);overflow-y:auto;margin:0 !important;padding:22px !important;border-radius:22px !important;box-shadow:0 24px 80px rgba(0,0,0,.55);opacity:0;visibility:hidden;display:block !important;pointer-events:none;transition:opacity .18s ease,transform .18s ease,visibility .18s}
    #formCard.formCard.open{opacity:1;visibility:visible;pointer-events:auto;transform:translate(-50%,-50%) scale(1)}body.rule-modal-open{overflow:hidden}
    @media(max-width:520px){.vehicleFilterTitle{font-size:12.5px !important}.vehicleFilterMeta{font-size:10px !important}#statusActions{gap:6px}.hero #allCarsLink{height:38px;padding:0 11px;font-size:11.5px}.hero #statusActions .status{height:38px}#formCard.formCard{top:auto !important;bottom:12px !important;transform:translateX(-50%) translateY(18px);width:calc(100vw - 20px) !important;max-height:calc(100dvh - 32px);border-radius:22px !important;padding:20px !important}#formCard.formCard.open{transform:translateX(-50%) translateY(0)}}`;
  document.head.appendChild(style);
  window.addEventListener('DOMContentLoaded',()=>{
    const count=document.getElementById('countText'),form=document.getElementById('formCard');
    if(count&&!document.getElementById('sharedHint')){const hint=document.createElement('div');hint.id='sharedHint';hint.textContent='共享关注 · 所有人看到同一列表';hint.style.cssText='font-size:11px;color:#737d8e;margin-top:3px';count.insertAdjacentElement('afterend',hint)}
    const status=document.querySelector('.hero .status');
    if(status&&!document.getElementById('statusActions')){const wrap=document.createElement('div');wrap.id='statusActions';status.parentNode.insertBefore(wrap,status);wrap.appendChild(status)}
    const wrap=document.getElementById('statusActions');
    if(wrap&&!document.getElementById('allCarsLink')){const link=document.createElement('a');link.id='allCarsLink';link.href='https://m.akd.cn/';link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','查看全部车源');link.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg><span>查看全部车源</span>';wrap.insertBefore(link,status)}
    if(form){const backdrop=document.createElement('div');backdrop.id='ruleModalBackdrop';document.body.appendChild(backdrop);const sync=()=>{const open=form.classList.contains('open');backdrop.classList.toggle('open',open);document.body.classList.toggle('rule-modal-open',open)};new MutationObserver(sync).observe(form,{attributes:true,attributeFilter:['class']});sync();backdrop.addEventListener('click',()=>document.getElementById('cancel')?.click());document.addEventListener('keydown',e=>{if(e.key==='Escape'&&form.classList.contains('open'))document.getElementById('cancel')?.click()})}
  });
})();