(function(H){
const {esc,brl,num,pct,CHN,KEYS,days,fd}=H;
function chart(){
  const keys=H.active(),W=320,base=140,top=14,bw=28,gap=(W-7*bw)/8;
  if(!keys.length)return `<text x="160" y="85" text-anchor="middle">Nenhum canal conectado</text>`;
  const mp=H.products().filter(p=>p.mine);
  const data=days.map((_,i)=>{const o={};keys.forEach(k=>o[k]=mp.reduce((a,p)=>a+p.u[k]*p.p*p.d[i],0));o.t=keys.reduce((a,k)=>a+o[k],0);return o});
  const mx=Math.max(1,...data.map(d=>d.t));let h='';
  data.forEach((d,i)=>{
    let y=base;const x=gap+i*(bw+gap);
    keys.forEach(k=>{const hh=d[k]/mx*(base-top);y-=hh;h+=`<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(hh,0)}" fill="var(--${k})"><title>${CHN[k]}: ${brl(d[k])}</title></rect>`});
    h+=`<text x="${x+bw/2}" y="${base+16}" text-anchor="middle">${fd(days[i],{weekday:'short'}).replace('.','')}</text>`;
    if(d.t)h+=`<text x="${x+bw/2}" y="${y-4}" text-anchor="middle">${(d.t/1000).toFixed(1).replace('.',',')}k</text>`;
  });
  return h+`<line x1="0" x2="${W}" y1="${base}" y2="${base}" stroke="rgba(160,180,255,.25)"/>`;
}
H.views.dash={
  render(){
    const s=H.state,act=H.active(),mine=H.ranked('mine','all');
    const rev=mine.reduce((a,r)=>a+r.units*r.p.p,0),prev=mine.reduce((a,r)=>a+r.prev*r.p.p,0);
    const u=mine.reduce((a,r)=>a+r.units,0),pu=mine.reduce((a,r)=>a+r.prev,0);
    const o=Math.round(u/1.34),po=Math.round(pu/1.34),dl=pct(rev,prev);
    const k=(l,v,a,b)=>`<div class="glass kpi"><small>${l}</small><b>${v}</b><i class="${a>=b?'up':'down'}">${a>=b?'+':'−'}${Math.abs(pct(a,b))}%</i></div>`;
    const all=H.ranked(s.scope,s.ch),rows=all.slice(0,10),max=rows.length?rows[0].units:1;
    const mineName=esc(H.storeName());
    let list,ins='';
    if(!rows.length){
      list=`<li class="empty">${s.scope==='mine'?(act.length?'Sem vendas neste canal nesta semana.':'Nenhum marketplace conectado. Conecte o Mercado Livre, a Shopee ou o TikTok Shop para ver o ranking dos seus produtos.'):'Nenhuma venda encontrada.'}${s.scope==='mine'&&!act.length?'<br><button class="btn pri" data-go="int">Ir para Integrações</button>':''}</li>`;
    }else{
      list=rows.map((r,i)=>{
        const d=pct(r.units,r.prev),me=r.p.mine;
        const seg=r.keys.filter(x=>r.p.u[x]>0).map(x=>`<span class="${x}" style="width:${r.p.u[x]/max*100}%" title="${CHN[x]}: ${r.p.u[x]}"></span>`).join('');
        return `<li class="${me?'me':''}"><span class="rk">${i+1}</span><div style="min-width:0"><div class="nm">${esc(r.p.n)}</div><div class="st">${me?mineName:esc(r.p.st)}${me&&s.scope==='all'?'<span class="tag">Você</span>':''} · ${brl(r.p.p)}</div></div><div class="fig"><b>${num(r.units)} vendidos</b><span class="${d>=0?'up':'down'}">${d>=0?'▲':'▼'} ${Math.abs(d)}%</span></div><div class="bar">${seg}</div></li>`;
      }).join('');
      if(s.scope==='all'){const ix=all.findIndex(r=>r.p.mine);ins=ix>=0?`Seu produto mais vendido na plataforma, ${esc(all[ix].p.n)}, está em #${ix+1} de ${all.length}.`:''}
      else ins='Os segmentos da barra mostram as unidades por canal. Comparação com a semana anterior.';
    }
    return H.head('Dashboard',`Semana de ${fd(days[0],{day:'numeric',month:'short'})} a ${fd(days[6],{day:'numeric',month:'short',year:'numeric'})}`)+
    `<p class="lead">${act.length?`Você vendeu ${brl(rev)} nesta semana, <span class="${dl>=0?'up':'down'}">${dl>=0?'alta':'queda'} de ${Math.abs(dl)}%</span> sobre a semana anterior.`:'Conecte um marketplace para acompanhar suas vendas.'}</p>
    <div class="kpis stag">${act.length?k('Receita',brl(rev),rev,prev)+k('Pedidos',num(o),o,po)+k('Unidades vendidas',num(u),u,pu)+k('Ticket médio',brl(o?rev/o:0),o?rev/o:0,po?prev/po:0):''}</div>
    <div class="dgrid"><div class="glass pan"><div class="row-h"><h2>Top 10 da semana</h2>
      <div class="seg" role="group" aria-label="Escopo"><button data-scope="mine" aria-pressed="${s.scope==='mine'}">Minha loja</button><button data-scope="all" aria-pressed="${s.scope==='all'}">Todas as lojas</button></div></div>
      <div class="chips" role="group" aria-label="Filtrar por canal">${[['all','Todos os canais']].concat(KEYS.map(x=>[x,CHN[x]])).map(([x,l])=>`<button class="chip" data-ch="${x}" aria-pressed="${s.ch===x}">${x==='all'?'':`<span class="dot ${x}"></span>`}${l}</button>`).join('')}</div>
      <ol class="rank">${list}</ol><p class="note">${ins}</p></div>
    <div><div class="glass pan"><h2 style="font-size:20px">Receita diária da minha loja</h2>
      <svg viewBox="0 0 320 170" width="100%" role="img" aria-label="Receita diária por canal nos últimos 7 dias">${chart()}</svg>
      <div class="legend">${act.map(x=>`<span><i class="dot ${x}"></i>${CHN[x]}</span>`).join('')}</div></div></div></div>`;
  },
  bind(r){r.onclick=e=>{const t=e.target.closest('button');if(!t)return;
    if(t.dataset.scope){H.state.scope=t.dataset.scope;H.rerender()}
    else if(t.dataset.ch){H.state.ch=t.dataset.ch;H.rerender()}}}
};
})(Hub);
