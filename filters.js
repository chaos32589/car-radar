(()=>{
  let activeKey='all';
  let latestData=null;
  let applying=false;
  let refreshTimer=null;

  const style=document.createElement('style');
  style.textContent=`
    .vehicleFilters{display:flex;gap:8px;overflow-x:auto;padding:10px 0 2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .vehicleFilters::-webkit-scrollbar{display:none}
    .vehicleFilter{appearance:none;flex:0 0 auto;border:1px solid #2b3340;background:#171d26;color:#aeb7c6;border-radius:13px;padding:8px 11px;text-align:left;min-width:116px;cursor:pointer}
    .vehicleFilter.active{background:#20263d;border-color:#6674d9;color:#f5f7fb;box-shadow:inset 0 0 0 1px rgba(157,168,255,.18)}
    .vehicleFilterTitle{font-size:12px;font-weight:750;white-space:nowrap;color:#e7ebf2}
    .vehicleFilterMeta{font-size:10px;color:#7f8998;margin-top:3px;white-space:nowrap}
    .vehicleFilter.active .vehicleFilterMeta{color:#aeb8ff}
    .filterResultHint{font-size:11px;color:#737d8e;margin-top:8px}
  `;
  document.head.appendChild(style);

  function keyOf(m){return `${m.brand||''}|||${m.model||''}`}
  function parseStatKey(label){
    const text=String(label||'').trim();
    const i=text.indexOf(' ');
    return i<0?{brand:'',model:text}:{brand:text.slice(0,i),model:text.slice(i+1)};
  }
  function grouped(d){
    const matches=d.matches||[];
    return Object.entries(d.rule_stats||{}).map(([label,total])=>{
      const {brand,model}=parseStatKey(label);
      const key=`${brand}|||${model}`;
      return {key,brand,model,total,matched:matches.filter(m=>keyOf(m)===key).length};
    });
  }
  function filterHtml(d){
    const groups=grouped(d);
    const total=groups.reduce((s,g)=>s+(Number(g.total)||0),0);
    const matched=(d.matches||[]).length;
    const items=[{key:'all',brand:'全部车型',model:'',total,matched},...groups];
    return `<div class="vehicleFilters">${items.map(x=>`<button type="button" class="vehicleFilter ${activeKey===x.key?'active':''}" data-filter-key="${x.key}"><div class="vehicleFilterTitle">${x.brand}${x.model?' '+x.model:''}</div><div class="vehicleFilterMeta">总 ${x.total==null?'—':x.total} · 匹配 ${x.matched}</div></button>`).join('')}</div>`;
  }
  function decorateSummary(d,list){
    const summary=document.getElementById('scanSummary');
    if(!summary)return;
    const groups=grouped(d);
    const selected=activeKey==='all'?null:groups.find(g=>g.key===activeKey);
    summary.innerHTML=`<strong>当前结果</strong><br>扫描车源：${d.fetched_count||0} 辆 · 符合条件：${(d.matches||[]).length} 辆${filterHtml(d)}<div class="filterResultHint">${selected?`当前显示 ${selected.brand} ${selected.model} · ${list.length} 辆匹配车源`:`当前显示全部 · ${list.length} 辆匹配车源`}</div>`;
  }
  function draw(d){
    if(!d||applying)return;
    applying=true;
    try{
      latestData=d;
      const groups=grouped(d);
      if(activeKey!=='all'&&!groups.some(g=>g.key===activeKey))activeKey='all';
      const all=d.matches||[];
      const list=activeKey==='all'?all:all.filter(m=>keyOf(m)===activeKey);
      renderResults({...d,matches:list,matched_count:list.length});
      decorateSummary(d,list);
    }finally{
      setTimeout(()=>{applying=false},0);
    }
  }
  async function syncLatest(){
    try{
      const d=await req(LATEST);
      draw(d);
    }catch(e){console.warn('filter sync failed',e)}
  }
  function scheduleSync(delay=120){
    clearTimeout(refreshTimer);
    refreshTimer=setTimeout(syncLatest,delay);
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('[data-filter-key]');
    if(btn){
      e.preventDefault();
      activeKey=btn.dataset.filterKey||'all';
      if(latestData)draw(latestData);
      return;
    }
    if(e.target.closest?.('#scanNow')){
      scheduleSync(800);
      setTimeout(syncLatest,2500);
      setTimeout(syncLatest,6000);
    }
  });

  const summary=document.getElementById('scanSummary');
  if(summary){
    const mo=new MutationObserver(()=>{
      if(applying)return;
      if(!summary.querySelector('.vehicleFilters'))scheduleSync(80);
    });
    mo.observe(summary,{childList:true,subtree:true});
  }

  syncLatest();
  setTimeout(syncLatest,500);
  setTimeout(syncLatest,1500);
})();
