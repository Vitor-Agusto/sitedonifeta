(function(H){
const {brl,num,pct,CHN,days,fd}=H;
H.views.ana={
  render(){
    const act=H.active(),head=H.head('Análises','Compare a semana atual com a anterior, por canal, dia e categoria.');
    if(!act.length)return head+`<div class="glass">${H.empty('Conecte um marketplace para gerar análises.',['int','Ir para Integrações'])}</div>`;
    const mine=H.products().filter(p=>p.mine);
    const rev=(k,pr)=>mine.reduce((a,p)=>a+(pr?p.pv[k]:p.u[k])*p.p,0);
    const byCh=act.map(k=>({k,v:rev(k,0),pv:rev(k,1)}));
    const tot=byCh.reduce((a,c)=>a+c.v,0),ptot=byCh.reduce((a,c)=>a+c.pv,0);
    const units=mine.reduce((a,p)=>a+act.reduce((x,k)=>x+p.u[k],0),0);
    const cur=days.map((_,i)=>mine.reduce((a,p)=>a+act.reduce((x,k)=>x+p.u[k],0)*p.p*p.d[i],0));
    const prv=days.map((_,i)=>mine.reduce((a,p)=>a+act.reduce((x,k)=>x+p.pv[k],0)*p.p*p.d[i],0));
    const best=cur.indexOf(Math.max(...cur));
    const cats={};mine.forEach(p=>{cats[p.cat]=(cats[p.cat]||0)+act.reduce((x,k)=>x+p.u[k],0)*p.p});
    const cl=Object.entries(cats).filter(c=>c[1]>0).sort((a,b)=>b[1]-a[1]);
    const mx=Math.max(...byCh.map(c=>c.v),1),cmx=Math.max(...cl.map(c=>c[1]),1);
    const W=520,Ht=190,L=10,B=26,T=14,ym=Math.max(...cur,...prv,1);
    const X=i=>L+i*(W-2*L)/6,Y=v=>Ht-B-v/ym*(Ht-B-T);
    const line=a=>a.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const k=(l,v,x)=>`<div class="glass kpi"><small>${l}</small><b>${v}</b>${x||''}</div>`;
    const d=pct(tot,ptot);
    return head+`<div class="kpis stag">${k('Receita da semana',brl(tot),`<i class="${d>=0?'up':'down'}">${d>=0?'+':'−'}${Math.abs(d)}%</i>`)}${k('Unidades vendidas',num(units))}${k('Ticket médio',brl(tot/Math.max(1,Math.round(units/1.34))))}${k('Melhor dia',fd(days[best],{weekday:'long'}).replace('-feira',''))}</div>
    <div class="ana stag">
    <div class="glass pan"><h2 style="font-size:20px;margin-bottom:8px">Receita por canal</h2>${byCh.map(c=>{const dd=pct(c.v,c.pv);return `<div class="hb"><span><i class="dot ${c.k}"></i> ${CHN[c.k]}</span><div class="tr"><i class="bg-${c.k}" style="width:${c.v/mx*100}%"></i></div><b>${brl(c.v)} <span class="${dd>=0?'up':'down'}" style="font-size:12px">${dd>=0?'+':'−'}${Math.abs(dd)}%</span></b></div>`}).join('')}</div>
    <div class="glass pan"><h2 style="font-size:20px;margin-bottom:8px">Receita por categoria</h2>${cl.map(c=>`<div class="hb"><span>${H.esc(c[0])}</span><div class="tr"><i class="bg-cat" style="width:${c[1]/cmx*100}%"></i></div><b>${brl(c[1])}</b></div>`).join('')||'<p class="mute">Sem vendas.</p>'}</div>
    <div class="glass pan wide"><h2 style="font-size:20px">Receita diária: esta semana vs. anterior</h2>
      <svg viewBox="0 0 ${W} ${Ht}" width="100%" role="img" aria-label="Linha de receita diária">
      ${[0,.5,1].map(f=>`<line x1="${L}" x2="${W-L}" y1="${Y(ym*f)}" y2="${Y(ym*f)}" stroke="rgba(160,180,255,.15)"/>`).join('')}
      <polyline points="${line(prv)}" fill="none" stroke="var(--mute)" stroke-width="2" stroke-dasharray="5 5"/>
      <polyline points="${line(cur)}" fill="none" stroke="var(--cy)" stroke-width="3" stroke-linejoin="round"/>
      ${cur.map((v,i)=>`<circle cx="${X(i)}" cy="${Y(v)}" r="4" fill="var(--cy)"><title>${fd(days[i],{weekday:'short',day:'numeric'})}: ${brl(v)}</title></circle><text x="${X(i)}" y="${Ht-8}" text-anchor="middle">${fd(days[i],{weekday:'short'}).replace('.','')}</text>`).join('')}</svg>
      <div class="legend"><span><i class="dot" style="background:var(--cy)"></i>Esta semana</span><span><i class="dot" style="background:var(--mute)"></i>Semana anterior</span></div></div></div>`;
  }
};
})(Hub);
