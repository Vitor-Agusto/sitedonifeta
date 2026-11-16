(function(H){
const {esc}=H;
const INT=[
 {id:'ml',g:'mk',n:'Mercado Livre',d:'Conecte sua loja Mercado Livre para importar pedidos e atualizar estoque automaticamente.',oauth:1,logo:'<span class="lg ml">mercado livre</span>'},
 {id:'sp',g:'mk',n:'Shopee',d:'Sincronize produtos e vendas da Shopee à sua conta Fourncy.ia.',logo:'<span class="lg sp"><i>S</i>Shopee</span>'},
 {id:'tt',g:'mk',n:'TikTok Shop',d:'Integre o TikTok Shop para gerenciar pedidos e campanhas.',logo:'<span class="lg tt"><i>♪</i>TikTok Shop</span>'},
 {id:'cj',g:'su',n:'CJDropshipping',d:'Importe produtos e sincronize fulfillment automaticamente.',ph:'Cole sua API Key do CJDropshipping',logo:'<span class="lg cj"><i>CJ</i>CJDropshipping</span>'},
 {id:'hy',g:'su',n:'Hayamax',d:'Integre o catálogo da Hayamax para dropshipping.',logo:'<span class="lg hy"><i>H</i>Hayamax</span>'},
 {id:'ab',g:'su',n:'Atacado Barato',d:'Conecte-se ao fornecedor Atacado Barato para preços e estoque.',logo:'<span class="lg ab"><i>A</i>Atacado Barato</span>'}
];
const card=it=>{
  const on=H.state.conn[it.id];
  const field=on?'<div class="fld"><input value="••••••••••••" disabled aria-label="API Key salva"></div>':
    `<div class="fld"><input id="k-${it.id}" placeholder="${it.ph||'Insira sua API Key'}" autocomplete="off" aria-label="API Key ${it.n}">${it.oauth?'<svg class="i" viewBox="0 0 24 24" style="color:var(--mute)"><circle cx="8" cy="15" r="3.5"/><path d="M10.5 12.5L19 4M16 7l2.5 2.5"/></svg>':''}</div>`;
  let act;
  if(on)act=`<button class="btn off" data-off="${it.id}">Desconectar</button>`;
  else if(it.oauth)act=`<button class="btn pri" data-oauth="${it.id}"><svg class="i" viewBox="0 0 24 24"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1"/></svg>Conectar Loja via Oauth</button>`;
  else act=`<button class="btn ${it.id==='cj'?'vio':''}" data-on="${it.id}"><svg class="i" viewBox="0 0 24 24"><path d="M4 9h13l-3-3M20 15H7l3 3"/></svg>Conectar</button>`;
  return `<article class="glass card"><div class="ch">${it.logo}<span class="pill ${on?'on':''}">${on?'Conectado':'Desconectado'}</span></div>
  <h3>${it.n}</h3><p>${it.d}</p><label for="k-${it.id}">API Key</label>${field}<p class="msg" id="m-${it.id}"></p>${act}</article>`;
};
const done=(id,msg)=>{H.state.conn[id]=true;H.save();H.rerender();H.refresh();H.toast(msg)};
H.views.int={search:true,ph:'Buscar integração...',
  render(){
    const q=H.state.q.trim().toLowerCase();
    const grp=g=>INT.filter(i=>i.g===g&&i.n.toLowerCase().includes(q)).map(card).join('');
    const mk=grp('mk'),su=grp('su');
    const conn=INT.filter(i=>H.state.conn[i.id]).length;
    return H.head('Integrações / Conexões','Conecte sua conta para sincronizar marketplaces e fornecedores. Suas credenciais são criptografadas e seguras.',
    `<div class="glass how"><h3>${H.ico('M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z')}Conecte sua conta</h3><ol><li>Escolha o marketplace ou fornecedor</li><li>Clique em Conectar e autorize via Oauth</li><li>Insira sua API Key para finalizar a sincronização</li></ol></div>`)+
    `<div class="sec"><h2>Marketplaces</h2><span class="cnt">3 integrações disponíveis</span></div><div class="cards stag">${mk}</div>
    <div class="sec"><h2>Fornecedores</h2><span class="cnt">3 fornecedores disponíveis</span></div><div class="cards stag">${su}</div>
    ${mk||su?'':H.empty('Nenhuma integração encontrada. Tente outro nome.')}
    <p class="note">${conn} de 6 integrações conectadas. Modo demonstração: a conexão é simulada e a chave digitada não é guardada.</p>`;
  },
  bind(r){r.onclick=e=>{
    const t=e.target.closest('button');if(!t)return;const d=t.dataset;
    if(d.on){
      const inp=document.getElementById('k-'+d.on);
      if(!inp.value.trim()){inp.parentElement.classList.add('err');document.getElementById('m-'+d.on).textContent='Insira sua API Key para conectar.';inp.focus();return}
      t.disabled=true;t.textContent='Conectando…';
      const it=INT.find(i=>i.id===d.on);setTimeout(()=>done(d.on,it.n+' conectado.'),700);
    }else if(d.oauth){
      const it=INT.find(i=>i.id===d.oauth);
      H.modal({title:'Conectar '+it.n,ok:'Autorizar',body:`<p>A Fourncy.ia vai ler pedidos e anúncios da sua conta ${it.n}. Ela não altera preços nem edita anúncios.</p>`,onOk(){done(it.id,it.n+' conectado.')}});
    }else if(d.off){
      const it=INT.find(i=>i.id===d.off);
      H.modal({title:'Desconectar '+it.n,danger:true,ok:'Desconectar',body:`<p>Os dados de ${it.n} saem do Dashboard, dos Pedidos e das Análises até você conectar de novo.</p>`,onOk(){H.state.conn[it.id]=false;H.save();H.rerender();H.refresh();H.toast(it.n+' desconectado.')}});
    }
  };
  r.oninput=e=>{if(e.target.closest('.fld.err')){e.target.parentElement.classList.remove('err');const m=document.getElementById('m-'+e.target.id.slice(2));if(m)m.textContent=''}};}
};
})(Hub);
