(function(H){
H.authScreen=()=>{
  const $=H.$,f=$('#aForm'),err=$('#aErr'),go=$('#aGo');
  let mode='in',fails=0,lock=0;
  $('#auth').classList.remove('hide');
  const COPY={in:['Bem-vindo de volta','Entre para acompanhar suas vendas.','Entrar'],up:['Crie sua conta','Leva menos de um minuto.','Criar conta']};
  function setMode(m){
    mode=m;f.dataset.mode=m;err.textContent='';
    $('#aT').textContent=COPY[m][0];$('#aS').textContent=COPY[m][1];go.textContent=COPY[m][2];
    H.$$('[data-mode-btn]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.modeBtn===m));
    f.elements.pw.autocomplete=m==='up'?'new-password':'current-password';
  }
  const fail=(msg,field)=>{err.textContent=msg;f.elements[field].focus()};
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-mode-btn]');if(b)setMode(b.dataset.modeBtn);
    const eye=e.target.closest('[data-eye]');
    if(eye){const show=f.elements.pw.type==='password';f.elements.pw.type=f.elements.pw2.type=show?'text':'password';eye.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');eye.setAttribute('aria-pressed',show)}
  });
  f.elements.pw.addEventListener('input',e=>{
    const p=e.target.value;
    const sc=[p.length>=8,/[a-z]/.test(p)&&/[A-Z]/.test(p),/\d/.test(p),p.length>=12||/[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
    $('#aMeter').dataset.s=p?sc:0;
    $('#aMeterT').textContent=p?['Muito fraca','Fraca','Razoável','Boa','Forte'][sc]:'';
  });
  f.onsubmit=async e=>{
    e.preventDefault();err.textContent='';
    const d=new FormData(f),email=d.get('email').trim(),pw=d.get('pw'),name=(d.get('name')||'').trim();
    if(Date.now()<lock)return fail(`Muitas tentativas. Aguarde ${Math.ceil((lock-Date.now())/1000)} s.`,'pw');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))return fail('Digite um e-mail válido.','email');
    if(mode==='up'){
      if(name.length<2)return fail('Digite seu nome.','name');
      if(pw.length<8)return fail('A senha precisa ter pelo menos 8 caracteres.','pw');
      if(pw!==d.get('pw2'))return fail('As senhas não coincidem.','pw2');
    }else if(!pw)return fail('Digite sua senha.','pw');
    const label=go.textContent;go.disabled=true;go.textContent=mode==='up'?'Criando conta…':'Entrando…';
    try{
      const r=mode==='up'?await H.auth.create(name,email,pw):await H.auth.login(email,pw);
      if(r.err){
        if(mode==='in'&&++fails>=5){lock=Date.now()+30000;fails=0;err.textContent='Muitas tentativas. Aguarde 30 s.'}
        else err.textContent=r.err;
      }else{
        H.auth.session(r.acct.email,d.get('keep')==='on');
        const first=r.acct.name.split(' ')[0];
        H.boot(r.acct);f.reset();$('#aMeter').dataset.s=0;
        H.toast(mode==='up'?'Conta criada. Bem-vindo(a), '+first+'!':'Bem-vindo(a) de volta, '+first+'!');
      }
    }catch(x){err.textContent='Este navegador não permite criptografia aqui. Abra a página por https.'}
    go.disabled=false;go.textContent=label;
  };
  setMode('in');f.elements.email.focus();
};
})(Hub);
