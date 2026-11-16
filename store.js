(function(H){
const keyOf=()=>'fourncy-hub-v4:'+H.uid;
const def=(name,email)=>({
  conn:{ml:false,sp:false,tt:false,cj:false,hy:false,ab:false},
  extra:[],del:[],ed:{},os:{},
  auto:{lowstock:true,pause:false,sync:true,reply:false,report:false},
  log:[],
  set:{user:name,store:'Minha loja',min:15,mail:true},
  team:[{id:'t1',n:name,e:email,r:'Proprietário'}]
});
/* chamado após o login: carrega (ou cria) o estado da conta */
H.loadState=acct=>{
  H.uid=acct.email;H.email=acct.email;
  const d=def(acct.name,acct.email);
  H.state=Object.assign(def(acct.name,acct.email),{q:'',scope:'mine',ch:'all',sort:{k:'sales',d:-1},pfil:'all',ofil:'all',ocan:'all',cur:'int'});
  try{
    const v=JSON.parse(localStorage.getItem(keyOf())||'null');
    if(v)for(const k in d)if(k in v)H.state[k]=(d[k]&&typeof d[k]==='object'&&!Array.isArray(d[k]))?Object.assign(H.state[k],v[k]):v[k];
  }catch(e){}
};
H.save=()=>{try{
  const s=H.state,keep={conn:s.conn,extra:s.extra,del:s.del,ed:s.ed,os:s.os,auto:s.auto,log:s.log,set:s.set,team:s.team};
  localStorage.setItem(keyOf(),JSON.stringify(keep));
}catch(e){}};
H.reset=()=>{try{localStorage.removeItem(keyOf())}catch(e){}location.reload()};

H.active=()=>H.KEYS.filter(k=>H.state.conn[k]);
H.storeName=()=>H.state.set.store;
H.products=()=>{
  const s=H.state,z={ml:0,tt:0,sp:0};
  const extra=s.extra.map(x=>Object.assign({mine:true,st:'',u:z,pv:z,d:[1/7,1/7,1/7,1/7,1/7,1/7,1/7]},x));
  return H.base.concat(extra).filter(p=>!s.del.includes(p.id)).map(p=>s.ed[p.id]?Object.assign({},p,s.ed[p.id]):p);
};
H.ranked=(scope,filter)=>{
  let keys=filter==='all'?H.KEYS:[filter];
  if(scope==='mine')keys=keys.filter(k=>H.state.conn[k]);
  const sum=(p,pr)=>keys.reduce((a,k)=>a+(pr?p.pv[k]:p.u[k]),0);
  return H.products().filter(p=>scope==='all'||p.mine).map(p=>({p,units:sum(p,0),prev:sum(p,1),keys}))
    .filter(r=>r.units>0).sort((a,b)=>b.units-a.units);
};
H.orderList=()=>H.orders.filter(o=>H.state.conn[o.ch]).map(o=>Object.assign({},o,{s:H.state.os[o.id]||o.s}));
H.lowStock=()=>H.products().filter(p=>p.mine&&p.stock<=+H.state.set.min);
H.alerts=()=>{
  const a=[],s=H.state;
  if(!H.active().length)a.push({m:'Conecte um marketplace para sincronizar suas vendas.',go:'int'});
  if(s.auto.lowstock){const n=H.lowStock().length;if(n)a.push({m:`${n} produto${n>1?'s':''} com estoque baixo.`,go:'prod'})}
  const pend=H.orderList().filter(o=>o.s==='Pendente').length;
  if(pend)a.push({m:`${pend} pedido${pend>1?'s':''} aguardando pagamento.`,go:'ped'});
  return a;
};
})(Hub);
