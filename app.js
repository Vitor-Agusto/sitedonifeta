(function(H){
const {$,$$,ico}=H;
const NAV=[['dash','Dashboard','M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z'],['prod','Produtos','M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9'],['ped','Pedidos','M8 4h8v3H8zM6 6h12v15H6zM9 12h6M9 16h6'],['int','Integrações','M4 7h10M18 7h2M4 17h2M10 17h10M14 5v4M6 15v4'],['ana','Análises','M5 20V10M12 20V4M19 20v-7'],['aut','Automações','M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z'],['cfg','Configurações','M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM12 3v3M12 18v3M3 12h3M18 12h3'],['eq','Equipe','M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 3-5 6-5s6 2 6 5M17 11a2.5 2.5 0 100-5M21 19c0-2-1.5-3.5-4-4'],['aj','Ajuda','M12 3a9 9 0 100 18 9 9 0 000-18zM9.5 9.5a2.5 2.5 0 115 0c0 2-2.5 2-2.5 4M12 17v.5']];
const ids=NAV.map(n=>n[0]);
const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
let tok=0;
const route=()=>{const id=location.hash.replace('#/','');return ids.includes(id)?id:'int'};
H.go=id=>{if(location.hash==='#/'+id)return;location.hash='#/'+id};

H.refresh=()=>{
  const s=H.state.set,a=H.alerts();
  $('#uName').textContent=s.user;$('#uAv').textContent=s.user.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
  $('#bell').classList.toggle('n',a.length>0);
  $('#popl').innerHTML=a.length?a.map(x=>`<button data-go="${x.go}">${H.esc(x.m)}</button>`).join(''):'<p class="mute pad">Nenhum alerta no momento.</p>';
};
H.rerender=()=>{
  const r=$('#view'),v=H.views[H.cur];
  r.className='';r.innerHTML=v.render();v.bind&&v.bind(r);
};
function mount(id){
  const r=$('#view'),v=H.views[id];
  H.cur=id;H.state.q='';
  const q=$('#q');q.value='';q.disabled=!v.search;q.placeholder=v.search?v.ph:'Sem busca nesta página';
  r.className='';r.innerHTML=v.render();v.bind&&v.bind(r);
  void r.offsetWidth;r.classList.add('enter');
  $$('#nav button').forEach(b=>{if(b.dataset.go===id)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  H.refresh();window.scrollTo({top:0});
}
function show(animate){
  const id=route(),r=$('#view'),t=++tok;
  if(!animate||reduced||id===H.cur){mount(id);return}
  r.classList.remove('enter');r.classList.add('leaving');
  setTimeout(()=>{if(t===tok){mount(id);r.classList.remove('leaving')}},150);
}
$('#nav').innerHTML=NAV.map(([id,l,d])=>`<button data-go="${id}">${ico(d)}${l}</button>`).join('');
window.addEventListener('hashchange',()=>show(true));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-logout]')){H.auth.logout();return}
  const g=e.target.closest('[data-go]');
  if(g){$('#pop').classList.add('hide');$('#bell').setAttribute('aria-expanded','false');H.go(g.dataset.go);return}
  if(e.target.closest('#bell')){const p=$('#pop'),open=p.classList.toggle('hide')===false;$('#bell').setAttribute('aria-expanded',open);return}
  if(!e.target.closest('#pop')){$('#pop').classList.add('hide');$('#bell').setAttribute('aria-expanded','false')}
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#pop').classList.add('hide')});
$('#q').addEventListener('input',e=>{if(H.views[H.cur].search){H.state.q=e.target.value;H.rerender()}});
H.boot=acct=>{H.loadState(acct);$('#auth').classList.add('hide');$('#app').classList.remove('hide');show(false)};
})(Hub);
