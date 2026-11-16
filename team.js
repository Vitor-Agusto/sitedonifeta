(function(H){
const {esc}=H;
const ROLES=['Administrador','Editor','Visualizador'];
const ini=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
H.views.eq={search:true,ph:'Buscar membro...',
  render(){
    const q=H.state.q.trim().toLowerCase(),list=H.state.team.filter(m=>!q||(m.n+m.e).toLowerCase().includes(q));
    return H.head('Equipe',`${H.state.team.length} pessoas com acesso à sua conta.`,'<button class="btn pri fit" data-add>+ Convidar membro</button>')+
    (list.length?`<div class="tgrid stag">${list.map(m=>`<article class="glass mem"><div class="hd"><span class="av">${esc(ini(m.n))}</span><div style="min-width:0"><b>${esc(m.n)}</b><div class="st" style="overflow:hidden;text-overflow:ellipsis">${esc(m.e)}</div></div></div>
    ${m.r==='Proprietário'?'<span class="pill info" style="align-self:flex-start">Proprietário</span>':`<select data-role="${m.id}" aria-label="Função de ${esc(m.n)}">${ROLES.map(r=>`<option ${r===m.r?'selected':''}>${r}</option>`).join('')}</select><button class="btn off sm" data-rm="${m.id}" style="align-self:flex-start">Remover</button>`}</article>`).join('')}</div>`:`<div class="glass">${H.empty('Nenhum membro encontrado.')}</div>`);
  },
  bind(r){
    r.onclick=e=>{
      const t=e.target.closest('button');if(!t)return;
      if('add' in t.dataset)H.modal({title:'Convidar membro',ok:'Convidar',body:`<label class="f">Nome<input name="n" required maxlength="40"></label><label class="f">E-mail<input name="e" type="email" required maxlength="80"></label><label class="f">Função<select name="r">${ROLES.map(x=>`<option>${x}</option>`).join('')}</select></label>`,
        onOk(f){H.state.team.push({id:'t'+Date.now(),n:f.get('n').trim(),e:f.get('e').trim(),r:f.get('r')});H.save();H.rerender();H.toast('Convite enviado (simulado).')}});
      else if(t.dataset.rm){const m=H.state.team.find(x=>x.id===t.dataset.rm);
        H.modal({title:'Remover membro',danger:true,ok:'Remover',body:`<p>Remover <b>${esc(m.n)}</b> da equipe? A pessoa perde o acesso à conta.</p>`,onOk(){H.state.team=H.state.team.filter(x=>x.id!==m.id);H.save();H.rerender();H.toast('Membro removido.')}})}
    };
    r.onchange=e=>{const s=e.target.closest('[data-role]');if(!s)return;
      H.state.team.find(x=>x.id===s.dataset.role).r=s.value;H.save();H.toast('Função atualizada.')};
  }
};
})(Hub);
