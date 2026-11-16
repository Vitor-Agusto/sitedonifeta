(function(H){
const {esc,brl2,CHN,KEYS}=H;
const FLOW={Pendente:'Pago',Pago:'Enviado',Enviado:'Entregue'};
const CLS={Pendente:'warn',Pago:'info',Enviado:'info',Entregue:'ok',Cancelado:'bad'};
const STS=['Pendente','Pago','Enviado','Entregue','Cancelado'];
const dt=t=>new Date(t).toLocaleString('pt-BR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
function visible(){
  const s=H.state,q=s.q.trim().toLowerCase();
  return H.orderList().filter(o=>(s.ocan==='all'||o.ch===s.ocan)&&(!q||(o.id+o.cust+o.n).toLowerCase().includes(q)));
}
H.views.ped={search:true,ph:'Buscar pedido, cliente ou produto...',
  render(){
    const s=H.state,base=visible(),rows=base.filter(o=>s.ofil==='all'||o.s===s.ofil);
    const cnt=x=>base.filter(o=>o.s===x).length;
    const total=base.filter(o=>o.s!=='Cancelado').reduce((a,o)=>a+o.qty*o.price,0);
    const head=H.head('Pedidos','Acompanhe e atualize os pedidos dos marketplaces conectados.',`<button class="btn off fit" data-csv ${rows.length?'':'disabled'}>Exportar CSV</button>`);
    if(!H.active().length)return head+`<div class="glass">${H.empty('Nenhum marketplace conectado, então ainda não há pedidos.',['int','Ir para Integrações'])}</div>`;
    return head+`<div class="chips" role="group" aria-label="Filtrar por status"><button class="chip" data-st="all" aria-pressed="${s.ofil==='all'}">Todos (${base.length})</button>${STS.map(x=>`<button class="chip" data-st="${x}" aria-pressed="${s.ofil===x}">${x} (${cnt(x)})</button>`).join('')}</div>
    <div class="chips" role="group" aria-label="Filtrar por canal"><button class="chip" data-can="all" aria-pressed="${s.ocan==='all'}">Todos os canais</button>${H.active().map(k=>`<button class="chip" data-can="${k}" aria-pressed="${s.ocan===k}"><span class="dot ${k}"></span>${CHN[k]}</button>`).join('')}</div>
    <p class="note" style="margin:0 0 12px">Receita dos pedidos listados (sem cancelados): <b>${brl2(total)}</b></p>
    <div class="glass">${rows.length?rows.map(o=>`<div class="ord"><div><div class="id">${o.id} <span class="pill ${CLS[o.s]}">${o.s}</span></div><div class="st">${esc(o.cust)} · ${dt(o.t)}</div></div>
      <div><div class="nm">${o.qty}× ${esc(o.n)}</div><div class="st"><span class="dot ${o.ch}"></span> ${CHN[o.ch]}</div></div>
      <b>${brl2(o.qty*o.price)}</b>
      <div class="acts">${FLOW[o.s]?`<button class="btn pri sm" data-adv="${o.id}">Marcar como ${FLOW[o.s].toLowerCase()}</button>`:''}${o.s==='Pendente'||o.s==='Pago'?`<button class="btn off sm" data-cancel="${o.id}">Cancelar</button>`:''}</div></div>`).join(''):H.empty('Nenhum pedido encontrado com esses filtros.')}</div>`;
  },
  bind(r){
    const set=(id,v)=>{H.state.os[id]=v;H.save();H.rerender();H.refresh()};
    r.onclick=e=>{
      const t=e.target.closest('button');if(!t)return;const d=t.dataset;
      if(d.st){H.state.ofil=d.st;H.rerender()}
      else if(d.can){H.state.ocan=d.can;H.rerender()}
      else if(d.adv){const o=H.orderList().find(x=>x.id===d.adv);set(o.id,FLOW[o.s]);H.toast(`Pedido ${o.id}: ${FLOW[o.s].toLowerCase()}.`)}
      else if(d.cancel){H.modal({title:'Cancelar pedido',danger:true,ok:'Cancelar pedido',body:`<p>Cancelar o pedido <b>${esc(d.cancel)}</b>? Esta ação não pode ser desfeita.</p>`,onOk(){set(d.cancel,'Cancelado');H.toast('Pedido cancelado.')}})}
      else if('csv' in d){
        const s=H.state,rows=visible().filter(o=>s.ofil==='all'||o.s===s.ofil);
        const csv=['Pedido;Cliente;Produto;Qtd;Canal;Total;Status;Data'].concat(rows.map(o=>[o.id,o.cust,o.n,o.qty,CHN[o.ch],(o.qty*o.price).toFixed(2).replace('.',','),o.s,dt(o.t)].join(';'))).join('\n');
        try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv'}));a.download='pedidos.csv';a.click();H.toast('Arquivo pedidos.csv gerado.')}catch(x){H.toast('Não foi possível gerar o arquivo.')}
      }
    };
  }
};
})(Hub);
