const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const hintCep = document.getElementById('hint-cep');
const telInput = document.getElementById('telefone');
const form = document.getElementById('dossierForm');
const status = document.getElementById('status');
const btn = document.getElementById('btnEnviar');

// Máscara simples de CEP
cepInput.addEventListener('input', () => {
    let v = cepInput.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5);
    cepInput.value = v;
});

// Busca real de endereço via API ViaCEP quando o CEP estiver completo
cepInput.addEventListener('blur', async () => {
    const cepLimpo = cepInput.value.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    hintCep.textContent = 'Consultando ViaCEP...';
    hintCep.className = 'hint';

    try {
        const resp = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await resp.json();

        if (data.erro) {
            hintCep.textContent = 'CEP não encontrado.';
            hintCep.className = 'hint err';
            ruaInput.value = '';
            return;
        }

        ruaInput.value = `${data.logradouro || ''}${data.bairro ? ', ' + data.bairro : ''} — ${data.localidade}/${data.uf}`;
        hintCep.textContent = 'Endereço localizado com sucesso.';
        hintCep.className = 'hint ok';
    } catch (err) {
        hintCep.textContent = 'Falha ao consultar o CEP. Verifique sua conexão.';
        hintCep.className = 'hint err';
    }
});

// Máscara de telefone
telInput.addEventListener('input', () => {
    let v = telInput.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
        v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (v.length > 5) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (v.length > 0) {
        v = v.replace(/(\d{0,2})/, '($1');
    }
    telInput.value = v;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        status.textContent = 'Preencha todos os campos obrigatórios.';
        status.style.color = '#b5302f';
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Registrando...';
    status.textContent = 'Salvando depoimento...';
    status.style.color = '#6f6655';

    // Aqui entraria a chamada para sua API real de cadastro, ex:
    // await fetch('https://sua-api.com/depoimentos', { method: 'POST', body: JSON.stringify(dados) });

    setTimeout(() => {
        window.location.href = 'agradecimento.html';
    }, 700);
});
