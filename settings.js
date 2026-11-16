(function(H){
H.views.cfg={
  render(){
    const s=H.state.set;
    return H.head('Configurações','Ajuste seu perfil, o nome da loja e os alertas.')+
    `<form class="glass form" id="cfgForm"><label class="f">E-mail da conta<input value="${H.esc(H.email)}" disabled></label><label class="f">Seu nome<input name="user" required maxlength="40" value="${H.esc(s.user)}"></label>
    <label class="f">Nome da loja<input name="store" required maxlength="40" value="${H.esc(s.store)}"></label>
    <label class="f">Estoque mínimo para alertas<input name="min" type="number" min="0" step="1" required value="${s.min}"></label>
    <div class="chk"><span>Receber alertas por e-mail</span>${H.sw(!!s.mail,'id="mailSw" aria-label="Receber alertas por e-mail"')}</div>
    <button class="btn pri fit">Salvar alterações</button></form>
    <div class="glass danger"><h3 style="font-size:18px;margin-bottom:6px">Restaurar dados de exemplo</h3><p class="mute" style="margin:0 0 14px">Apaga conexões, produtos criados, pedidos atualizados e regras salvas neste navegador.</p><button class="btn dng fit" data-reset>Restaurar tudo</button></div>`;
  },
  bind(r){
    r.onclick=e=>{
      const sw=e.target.closest('#mailSw');
      if(sw)sw.setAttribute('aria-checked',sw.getAttribute('aria-checked')!=='true');
      else if(e.target.closest('[data-reset]'))H.modal({title:'Restaurar dados de exemplo',danger:true,ok:'Restaurar',body:'<p>Esta ação apaga os dados salvos neste navegador e recarrega a página.</p>',onOk(){H.reset()}});
    };
    r.onsubmit=e=>{
      e.preventDefault();const f=new FormData(e.target),s=H.state.set;
      s.user=f.get('user').trim();H.auth.rename(H.email,s.user);s.store=f.get('store').trim();s.min=Math.max(0,Math.round(+f.get('min')));
      s.mail=document.getElementById('mailSw').getAttribute('aria-checked')==='true';
      H.save();H.refresh();H.toast('Configurações salvas.');
    };
  }
};
})(Hub);
