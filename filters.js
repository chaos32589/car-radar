(()=>{
  let activeKey='all';
  let latestData=null;
  const style=document.createElement('style');
  style.textContent=`
    .vehicleFilters{display:flex;gap:8px;overflow-x:auto;padding:10px 0 2px;scrollbar-width:none;-webkit-overflow-scrolling:touch}
    .vehicleFilters::-webkit-scrollbar{display:none}
    .vehicleFilter{flex:0 0 auto;border:1px solid #2b3340;background:#171d26;color:#aeb7c6;border-radius:13px;padding:8px 11px;text-align:left;min-width:116px;cursor:pointer}
    .vehicleFilter.active{background:#20263d;border-color:#6674d9;color:#f5f7fb;box-shadow:inset 0 0 0 1px rgba(157,168,255,.18)}
    .vehicleFilterTitle{font-size:12px;font-weight:750;white-space:nowrap;color:#e7ebf2}
    .vehicleFilterMeta{font-size:10px;color:#7f8998;margin-top:3px;white-space:nowrap}
    .vehicleFilter.active .vehicleFilterMeta{color:#aeb8ff}
    .filterResultHint{font-size:11px;color:#737d8e;margin-top:8px}
  `;
  document.head.appendChild(style);

  function keyOf(m){return `${m.brand||''}|||${m.model||''}`}
  function parseStatKey(k){const i=k.indexOf(' ');return i<0?{brand:'',model:k}:{brand:k.slice(0,i),model:k.slice(i+1)}}
  function grouped(d){
    const matches=d.matches||[];
    const out=[];
    for(const [label,total] of Object.entries(d.rule_stats||{})){
      const {brand,model}=parseStatKey(label);
      const key=`${brand}|||${model}`;
      const matched=matches.filter(m=>keyOf(m)===key).length;
      out.push({key,brand,model,total,matched});
    }
    return out;
  }
  function renderFilterBar(d){
    const groups=grouped(d);
    const total=groups.reduce((s,g)=>s+(Number(g.total)||0),0);
    const matched=(d.matches||[]).length;
    const items=[{key:'all',brand:'全部车型',model:'',total,matched},...groups];
    return `<div class="vehicleFilters">${items.map(x=>`<button class="vehicleFilter ${activeKey===x.key?'active':''}" data-filter-key="${x.key}"><div class="vehicleFilterTitle">${x.brand}${x.model?' '+x.model:''}</div><div class="vehicleFilterMeta">总 ${x.total==null?'—':x.total} · 匹配 ${x.matched}</div></button>`).join('')}</div>`;
  }
  function apply(d){
    latestData=d;
    const groups=grouped(d);
    if(activeKey!=='all'&&!groups.some(g=>g.key===activeKey)) activeKey='all';
    const all=d.matches||[];
    const list=activeKey==='all'?all:all.filter(m=>keyOf(m)===activeKey);
    const copy={...d,matches:list,matched_count:list.length};
    originalRender(copy);
    const summary=document.getElementById('scanSummary');
    if(!summary)return;
    const selected=activeKey==='all'?null:groups.find(g=>g.key===activeKey);
    summary.innerHTML=`<strong>当前结果</strong><br>扫描车源：${d.fetched_count||0} 辆 · 符合条件：${all.length} 辆${renderFilterBar(d)}<div class="filterResultHint">${selected?`当前显示 ${selected.brand} ${selected.model} · ${list.length} 辆匹配车源`:`当前显示全部 · ${list.length} 辆匹配车源`}</div>`;
  }

  const originalRender=renderResults;
  renderResults=apply;
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-filter-key]');
    if(!btn)return;
    activeKey=btn.dataset.filterKey||'all';
    if(latestData)apply(latestData);
  });
  if(typeof loadLatest==='function') loadLatest();
})();
