(function(H){
const RULES=[
 ['lowstock','Alerta de estoque baixo','Avisa no sino quando um produto chega ao estoque mínimo ou abaixo dele.'],
 ['pause','Pausar anúncios sem estoque','Pausa o anúncio quando o estoque chega a zero.'],
 ['sync','Sincronizar estoque a cada hora','Atualiza o estoque nos marketplaces conectados.'],
 ['reply','Resposta automática a mensagens','Envia uma mensagem de boas-vindas aos compradores.'],
 ['report','Relatório semanal por e-mail','Envia o resumo de vendas toda segunda-feira.']];
const hm=t=>new Date(t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const log=m=>{H.state.log.unshift({t:Date.now(),m});H.state.log=H.state.log.slice(0,8)};
H.views.aut={
  render(){
    const s=H.state,on=Object.values(s.auto).filter(Boolean).length;
    return H.head('Automações',`Deixe a Fourncy.ia cuidar das tarefas repetitivas. ${on} de ${RULES.length} regras ativas.`,'<button class="btn off fit" data-run>Verificar estoque agora</button>')+
    `<div class="glass">${RULES.map(([id,t,d])=>`<div class="rule"><div><b>${t}</b><span>${d}</span></div>${H.sw(!!s.auto[id],`data-rule="${id}" aria-label="${t}"`)}</div>`).join('')}</div>
    <div class="glass pan" style="margin-top:20px"><h2 style="font-size:20px;margin-bottom:8px">Atividade recente</h2>${s.log.length?`<ul class="log">${s.log.map(l=>`<li><time>${hm(l.t)}</time>${H.esc(l.m)}</li>`).join('')}</ul>`:'<p class="mute" style="margin:0">Nenhuma atividade ainda. Ative ou desative uma regra para ver o registro.</p>'}</div>`;
  },
  bind(r){r.onclick=e=>{
    const t=e.target.closest('button');if(!t)return;
    if(t.dataset.rule){const id=t.dataset.rule,s=H.state,name=RULES.find(x=>x[0]===id)[1];
      s.auto[id]=!s.auto[id];log(`Regra "${name}" ${s.auto[id]?'ativada':'desativada'}.`);H.save();H.rerender();H.refresh();H.toast(`Regra ${s.auto[id]?'ativada':'desativada'}.`)}
    else if('run' in t.dataset){
      const low=H.lowStock(),zero=low.filter(p=>p.stock===0).length;
      log(`Verificação manual: ${low.length} produto(s) no mínimo ou abaixo, ${zero} sem estoque.`);H.save();H.rerender();
      H.toast(low.length?`${low.length} produto(s) precisam de reposição.`:'Estoque em dia.');
    }};}
};
})(Hub);
