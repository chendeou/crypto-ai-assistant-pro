// 前端主逻辑（中文注释）
let TIMER=null;
function log(msg){ const t=new Date().toLocaleString(); const el=document.getElementById('log'); el.innerText = t + ' ' + msg + '\n' + el.innerText; }
async function fetchFromWorker(workerUrl, symbol){ try{ const url = workerUrl + '?symbol=' + encodeURIComponent(symbol); const r=await fetch(url); const text=await r.text(); return {ok:true, text}; }catch(e){ return {ok:false, error:e.message}; } }

async function tickOnce(symbols){
  const workerUrl = document.getElementById('workerUrl').value.trim();
  for(const s of symbols){ log('请求 '+s+' ...'); let res;
    if(workerUrl){ res=await fetchFromWorker(workerUrl,s); if(res.ok){ document.getElementById('list').innerHTML = res.text; log(s+' 已更新 (来自 Worker)'); continue; } else { log('调用 Worker 失败：'+res.error); } }
    try{
      const cg = await fetch(`https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(s)}`);
      const j = await cg.json();
      let id = null; if(j && j.coins && j.coins.length>0){ id = j.coins[0].id; }
      if(!id){ id = s; }
      const info = await fetch(`https://api.coingecko.com/api/v3/coins/${encodeURIComponent(id)}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`);
      const data = await info.json();
      const price = data.market_data && data.market_data.current_price && data.market_data.current_price.usd ? data.market_data.current_price.usd : 'N/A';
      const change = data.market_data && data.market_data.price_change_percentage_24h ? data.market_data.price_change_percentage_24h : 0;
      const html = `<div><b>${data.name||s}</b> - 价格: ${price} USD - 24h: ${change}%</div>`;
      document.getElementById('list').innerHTML = html;
      log(s+' 已更新 (前端降级)');
    }catch(e){ log('前端获取失败：'+e.message); }
  }
}

document.getElementById('start').onclick = ()=>{
  const syms = document.getElementById('symbols').value.split(',').map(x=>x.trim()).filter(Boolean);
  const sec = Math.max(10, Number(document.getElementById('interval').value)||60);
  if(TIMER) clearInterval(TIMER);
  tickOnce(syms);
  TIMER = setInterval(()=>tickOnce(syms), sec*1000);
  document.getElementById('start').style.display='none'; document.getElementById('stop').style.display='inline-block'; log('开始监控：'+syms.join(','));
}
document.getElementById('stop').onclick = ()=>{ if(TIMER) clearInterval(TIMER); TIMER=null; document.getElementById('start').style.display='inline-block'; document.getElementById('stop').style.display='none'; log('已停止'); }

document.getElementById('testPush').onclick = async ()=>{
  const workerUrl = document.getElementById('workerUrl').value.trim(); if(!workerUrl){ alert('请先填写 Cloudflare Worker URL 或部署后再测试'); return; }
  try{ const r = await fetch(workerUrl, {method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({symbol:'bitcoin', action:'测试推送', score:0.9, price:1234.56, time:new Date().toISOString(), message:'来自前端的测试推送'})}); const j = await r.text(); alert('已发送测试请求，Worker 返回:\n'+j); }catch(e){ alert('发送测试失败：'+e.message); }
}
