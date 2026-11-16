(function(H){
H.$=(s,r=document)=>r.querySelector(s);
H.$$=(s,r=document)=>[...r.querySelectorAll(s)];
H.ico=d=>`<svg class="i" viewBox="0 0 24 24"><path d="${d}"/></svg>`;
H.head=(title,sub,extra='')=>`<div class="top"><div><h1>${title}</h1><p class="sub">${sub}</p></div>${extra}</div>`;
H.empty=(msg,cta)=>`<div class="empty">${msg}${cta?`<br><button class="btn pri" data-go="${cta[0]}">${cta[1]}</button>`:''}</div>`;
H.toast=m=>{
  const t=document.createElement('div');t.className='toast';t.textContent=m;H.$('#toasts').append(t);
  setTimeout(()=>t.classList.add('out'),2600);setTimeout(()=>t.remove(),3000);
};
H.modal=({title,body='',ok='Salvar',danger=false,onOk})=>{
  const d=H.$('#dlg');
  d.innerHTML=`<form><h3>${title}</h3>${body}<div class="acts"><button type="button" class="btn off" data-x>Cancelar</button><button class="btn ${danger?'dng':'pri'}">${ok}</button></div></form>`;
  const f=d.firstChild;
  f.onsubmit=e=>{e.preventDefault();if(onOk(new FormData(f))!==false)d.close()};
  f.querySelector('[data-x]').onclick=()=>d.close();
  d.onclick=e=>{if(e.target===d)d.close()};
  d.showModal();
  const i=f.querySelector('input,select,textarea');if(i)i.focus();
};
H.sw=(on,attrs)=>`<button type="button" class="sw" role="switch" aria-checked="${on}" ${attrs}></button>`;
})(Hub);
