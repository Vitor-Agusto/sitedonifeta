window.Hub={views:{},state:null};
(function(H){
H.KEYS=['ml','tt','sp'];
H.CHN={ml:'Mercado Livre',tt:'TikTok Shop',sp:'Shopee'};
H.brl=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0});
H.brl2=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
H.num=n=>n.toLocaleString('pt-BR');
H.pct=(a,b)=>b?Math.round((a-b)/b*100):0;
H.esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
H.days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d});
H.fd=(d,o)=>new Date(d).toLocaleDateString('pt-BR',o);

/* dados de exemplo: nome, preço, base semanal, pesos ml/tt/sp, categoria, estoque */
const MINE=[
['Vela aromática lavanda 300g',49.9,210,.5,.3,.2,'Decoração',64],
['Kit organizador de gavetas (6 peças)',39.9,330,.6,0,.4,'Organização',120],
['Garrafa térmica 1L inox',89,150,.4,.4,.2,'Cozinha',9],
['Luminária LED de mesa',119,95,.7,.1,.2,'Decoração',31],
['Jogo de toalhas 4 peças',139,70,.5,0,.5,'Banho',0],
['Difusor de ambiente com varetas',64.9,185,.3,.5,.2,'Decoração',47],
['Porta-temperos giratório',74,60,.8,0,.2,'Cozinha',22],
['Tapete antiderrapante para banheiro',34.9,260,.4,.1,.5,'Banho',88],
['Manta de sofá microfibra',99,88,.6,.1,.3,'Decoração',12],
['Relógio de parede minimalista',79,52,.5,.2,.3,'Decoração',27]];
const OTHERS=[
['Fone Bluetooth sem fio TWS','Tech Nova',129,620,.3,.4,.3],['Carregador turbo 65W USB-C','Tech Nova',89.9,540,.5,.2,.3],['Suporte veicular para celular','Tech Nova',44.9,410,.4,.2,.4],
['Sérum vitamina C 30ml','Bela Pele',69.9,480,.2,.6,.2],['Protetor solar FPS 60','Bela Pele',54.9,590,.4,.3,.3],['Kit de pincéis de maquiagem','Bela Pele',59,300,.2,.5,.3],
['Tapete higiênico para cães (30 un.)','Pet Alegre',79.9,360,.6,0,.4],['Brinquedo mordedor resistente','Pet Alegre',29.9,270,.3,.3,.4],
['Garrafa shaker 700ml','Fit Mania',34.9,350,.3,.3,.4],['Kit faixas elásticas (5 níveis)','Fit Mania',49.9,225,.4,.2,.4],
['Camiseta oversized algodão','Moda Sol',69.9,700,.2,.5,.3],['Legging cintura alta','Moda Sol',84.9,455,.2,.5,.3],['Mochila infantil escolar','Kids Land',119,175,.5,.1,.4]];
let sd=42;const R=()=>(sd=sd*16807%2147483647)/2147483647;
const build=(id,n,st,p,b,w,x)=>{
  const u={},pv={};
  H.KEYS.forEach((k,i)=>{u[k]=Math.round(b*w[i]*(.8+R()*.4));pv[k]=Math.round(u[k]*(.72+R()*.55))});
  let d=Array.from({length:7},()=>.6+R()*.8);const t=d.reduce((a,c)=>a+c,0);
  return Object.assign({id,n,st,p,u,pv,d:d.map(v=>v/t)},x);
};
H.base=MINE.map((m,i)=>build('m'+i,m[0],'',m[1],m[2],m.slice(3,6),{mine:true,cat:m[6],stock:m[7],sku:'CA-'+(100+i)}))
  .concat(OTHERS.map((o,i)=>build('o'+i,o[0],o[1],o[2],o[3],o.slice(4,7),{mine:false})));

const NM=['Ana Souza','Bruno Lima','Carla Mendes','Diego Rocha','Elisa Prado','Fábio Nunes','Gabriela Dias','Henrique Alves','Isabela Torres','João Pedro','Karina Melo','Lucas Freitas'];
H.orders=Array.from({length:34},(_,i)=>{
  const p=H.base[Math.floor(R()*10)];
  const ks=H.KEYS.filter(k=>p.u[k]>0);
  const ch=ks[Math.floor(R()*ks.length)];
  const r=R();
  const d=new Date(H.days[Math.floor(R()*7)]);d.setHours(8+Math.floor(R()*12),Math.floor(R()*60));
  return{id:'FN-'+(1040+i),cust:NM[Math.floor(R()*NM.length)],pid:p.id,n:p.n,qty:1+Math.floor(R()*3),price:p.p,ch,t:d.getTime(),
    s:r<.15?'Pendente':r<.4?'Pago':r<.7?'Enviado':'Entregue'};
}).sort((a,b)=>b.t-a.t);
})(Hub);
