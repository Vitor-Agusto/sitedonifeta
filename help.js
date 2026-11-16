(function(H){
const FAQ=[
 ['Como conecto o Mercado Livre?','Abra Integrações, clique em "Conectar Loja via Oauth" e autorize o acesso. Depois da conexão, pedidos e vendas aparecem no Dashboard.'],
 ['Como conecto Shopee, TikTok Shop e fornecedores?','Cole a API Key gerada no painel do vendedor ou do fornecedor e clique em Conectar.'],
 ['O que é o Top 10 da semana?','É o ranking dos produtos mais vendidos nos últimos 7 dias. Você pode ver só a sua loja ou todas as lojas da plataforma, e filtrar por canal.'],
 ['Como atualizo o estoque?','Em Produtos, edite o número direto na tabela ou use o botão Editar. Alterações de estoque disparam os alertas configurados em Automações.'],
 ['Como atualizo o status de um pedido?','Em Pedidos, use o botão de avanço (pago, enviado, entregue) ou cancele pedidos pendentes e pagos.'],
 ['Meus dados ficam salvos onde?','Neste protótipo, no armazenamento do seu navegador. Em uma versão com servidor, as chaves ficariam criptografadas no backend.']];
const ICON='<svg class="i" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
H.views.aj={search:true,ph:'Buscar na ajuda...',
  render(){
    const q=H.state.q.trim().toLowerCase(),list=FAQ.filter(f=>!q||(f[0]+f[1]).toLowerCase().includes(q));
    return H.head('Ajuda','Respostas rápidas e contato com o suporte.')+
    `<div class="glass faq">${list.length?list.map((f,i)=>`<div class="qa" data-open="0"><button aria-expanded="false" data-qa>${f[0]}${ICON}</button><div class="ans"><div><p>${f[1]}</p></div></div></div>`).join(''):H.empty('Nada encontrado. Envie sua dúvida abaixo.')}</div>
    <form class="glass form" id="supForm"><h3 style="font-size:18px;margin-bottom:12px">Falar com o suporte</h3>
    <label class="f">Assunto<input name="s" required maxlength="80"></label>
    <label class="f">Mensagem<textarea name="m" rows="4" required maxlength="600"></textarea></label>
    <button class="btn pri fit">Enviar mensagem</button></form>`;
  },
  bind(r){
    r.onclick=e=>{const b=e.target.closest('[data-qa]');if(!b)return;const q=b.parentElement,o=q.dataset.open!=='1';
      q.dataset.open=o?'1':'0';b.setAttribute('aria-expanded',o)};
    r.onsubmit=e=>{e.preventDefault();e.target.reset();H.toast('Mensagem enviada (simulado). Respondemos em até 1 dia útil.')};
  }
};
})(Hub);
