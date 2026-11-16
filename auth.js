(function(H){
const UK='fourncy-accounts',SK='fourncy-session',enc=new TextEncoder();
const b64=a=>btoa(String.fromCharCode(...a)),unb=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const read=()=>{try{return JSON.parse(localStorage.getItem(UK)||'{}')}catch(e){return{}}};
const write=u=>{try{localStorage.setItem(UK,JSON.stringify(u));return true}catch(e){return false}};
const norm=e=>e.trim().toLowerCase();
async function derive(pw,salt){
  if(!(globalThis.crypto&&crypto.subtle))throw new Error('nocrypto');
  const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  return b64(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},k,256)));
}
H.auth={
  async create(name,email,pw){
    email=norm(email);const u=read();
    if(u[email])return{err:'Já existe uma conta com este e-mail.'};
    const salt=crypto.getRandomValues(new Uint8Array(16));
    u[email]={name:name.trim(),salt:b64(salt),hash:await derive(pw,salt)};
    if(!write(u))return{err:'Não foi possível salvar a conta neste navegador.'};
    return{acct:{email,name:u[email].name}};
  },
  async login(email,pw){
    email=norm(email);const a=read()[email];
    const h=await derive(pw,a?unb(a.salt):new Uint8Array(16));
    if(!a||h!==a.hash)return{err:'E-mail ou senha incorretos.'};
    return{acct:{email,name:a.name}};
  },
  session(email,remember){try{sessionStorage.removeItem(SK);localStorage.removeItem(SK);(remember?localStorage:sessionStorage).setItem(SK,email)}catch(e){}},
  current(){try{const e=sessionStorage.getItem(SK)||localStorage.getItem(SK),a=e&&read()[e];return a?{email:e,name:a.name}:null}catch(e){return null}},
  logout(){try{sessionStorage.removeItem(SK);localStorage.removeItem(SK)}catch(e){}location.hash='';location.reload()},
  rename(email,name){const u=read();if(u[email]){u[email].name=name;write(u)}}
};
})(Hub);
