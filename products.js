(function(H){
const {esc,brl2,num}=H;
const form=p=>`<label class="f">Nome<input name="n" required maxlength="80" value="${esc(p.n||'')}"></label>
<label class="f">Categoria<input name="cat" required maxlength="30" value="${esc(p.cat||'')}"></label>
<div class="g2"><label class="f">Preço (R$)<input name="p" type="number" step="0.01" min="0.01" required value="${p.p||''}"></label>
<label class="f">Estoque<input name="st" type="number" min="0" step="1" required value="${p.stock??''}"></label></div>`;
const val=f=>({n:f.get('n').trim(),cat:f.get('cat').trim(),p:+f.get('p'),stock:Math.round(+f.get('st'))});
function edit(id,patch){
  const s=H.state,x=s.extra.find(e=>e.id===id);
  if(x)Object.assign(x,patch);else s.ed[id]=Object.assign(s.ed[id]||{},patch);
  H.save();
}
H.views.prod={search:true,ph:'Buscar produto ou SKU...',
  render(){
    const s=H.state,q=s.q.trim().toLowerCase(),min=+s.set.min,act=H.active();
    let all=H.products().filter(p=>p.mine).map(p=>Object.assign({},p,{sales:act.reduce((a,k)=>a+p.u[k],0)}));
    const total=all.reduce((a,p)=>a+p.p*p.stock,0),low=all.filter(p=>p.stock<=min).length;
    let rows=all.filter(p=>!q||(p.n+p.sku+p.cat).toLowerCase().includes(q));
    const {k,d}=s.sort;
    rows.sort((a,b)=>k==='n'?d*a.n.localeCompare(b.n):d*(a[k]-b[k]));
    const th=(key,l)=>`<th><button class="sortb" data-sort="${key}">${l}${k===key?(d>0?' ▲':' ▼'):''}</button></th>`;
    const st=p=>p.stock===0?'<span class="pill bad">Sem estoque</span>':p.stock<=min?'<span class="pill warn">Estoque baixo</span>':'<span class="pill ok">Em estoque</span>';
    return H.head('Produtos','Gerencie preço e estoque do catálogo da sua loja.','<button class="btn pri fit" data-add>+ Novo produto</button>')+
    `<div class="kpis stag"><div class="glass kpi"><small>Produtos</small><b>${all.length}</b></div><div class="glass kpi"><small>Estoque baixo ou zerado</small><b class="${low?'down':''}">${low}</b></div><div class="glass kpi"><small>Valor em estoque</small><b>${brl2(total)}</b></div></div>
    <div class="glass tw">${rows.length?`<table><thead><tr>${th('n','Produto')}<th>SKU</th>${th('p','Preço')}${th('stock','Estoque')}${th('sales','Vendas na semana')}<th>Status</th><th></th></tr></thead><tbody>${rows.map(p=>`<tr>
      <td><div class="nm" style="max-width:280px">${esc(p.n)}</div><div class="st">${esc(p.cat)}</div></td><td>${esc(p.sku)}</td><td>${brl2(p.p)}</td>
      <td><input class="stk" type="number" min="0" step="1" value="${p.stock}" data-stock="${p.id}" aria-label="Estoque de ${esc(p.n)}"></td>
      <td>${act.length?num(p.sales):'—'}</td><td>${st(p)}</td>
      <td><div class="row-acts"><button class="btn off sm" data-edit="${p.id}">Editar</button><button class="btn off sm" data-del="${p.id}">Excluir</button></div></td></tr>`).join('')}</tbody></table>`:H.empty('Nenhum produto encontrado.')}</div>
    ${act.length?'':'<p class="note">Conecte um marketplace para ver as vendas por produto.</p>'}`;
  },
  bind(r){
    r.onclick=e=>{
      const t=e.target.closest('button');if(!t)return;const d=t.dataset;
      if(d.sort){const s=H.state.sort;H.state.sort=s.k===d.sort?{k:s.k,d:-s.d}:{k:d.sort,d:d.sort==='n'?1:-1};H.rerender()}
      else if('add' in d)H.modal({title:'Novo produto',body:form({}),ok:'Adicionar',onOk(f){
        H.state.extra.push(Object.assign({id:'u'+Date.now(),sku:'FN-'+Math.floor(1000+Math.random()*9000)},val(f)));
        H.save();H.rerender();H.refresh();H.toast('Produto adicionado.')}});
      else if(d.edit){const p=H.products().find(x=>x.id===d.edit);H.modal({title:'Editar produto',body:form(p),onOk(f){edit(p.id,val(f));H.rerender();H.refresh();H.toast('Produto atualizado.')}})}
      else if(d.del){const p=H.products().find(x=>x.id===d.del);H.modal({title:'Excluir produto',danger:true,ok:'Excluir',body:`<p>Excluir <b>${esc(p.n)}</b> do catálogo?</p>`,onOk(){
        const s=H.state;if(p.id[0]==='u')s.extra=s.extra.filter(x=>x.id!==p.id);else s.del.push(p.id);
        H.save();H.rerender();H.refresh();H.toast('Produto excluído.')}})}
    };
    r.onchange=e=>{const i=e.target.closest('[data-stock]');if(!i)return;
      edit(i.dataset.stock,{stock:Math.max(0,Math.round(+i.value||0))});H.rerender();H.refresh();H.toast('Estoque atualizado.')};
  }
};
})(Hub);
