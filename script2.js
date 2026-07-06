const cepInput = document.getElementById('cep');
const ruaInput = document.getElementById('rua');
const hintCep = document.getElementById('hint-cep');
const telInput = document.getElementById('telefone');
const form = document.getElementById('dossierForm');
const status = document.getElementById('status');
const btn = document.getElementById('btnEnviar');

// Máscara de CEP
cepInput.addEventListener('input', () => {
    let v = cepInput.value.replace(/\D/g, '').slice(0, 8);

    if (v.length > 5) {
        v = v.slice(0, 5) + '-' + v.slice(5);
    }

    cepInput.value = v;
});

// Busca do endereço pelo ViaCEP
cepInput.addEventListener('blur', async () => {
    const cepLimpo = cepInput.value.replace(/\D/g, '');

    if (cepLimpo.length !== 8) return;

    hintCep.textContent = 'Consultando CEP...';
    hintCep.className = 'hint';

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            hintCep.textContent = 'CEP não encontrado.';
            hintCep.className = 'hint err';
            ruaInput.value = '';
            return;
        }

        ruaInput.value = `${dados.logradouro}, ${dados.bairro} - ${dados.localidade}/${dados.uf}`;
        hintCep.textContent = 'Endereço encontrado!';
        hintCep.className = 'hint ok';

    } catch {
        hintCep.textContent = 'Erro ao consultar o CEP.';
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

// Envio do formulário
form.addEventListener('submit', async (e) => {

    e.preventDefault();

    if (!form.checkValidity()) {
        status.textContent = "Preencha todos os campos.";
        status.style.color = "red";
        return;
    }

    btn.disabled = true;
    btn.textContent = "Enviando...";
    status.textContent = "Enviando inscrição...";

    try {

        const resposta = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
                "Accept": "application/json"
            }
        });

        if (resposta.ok) {

            status.textContent = "Inscrição enviada com sucesso!";

            setTimeout(() => {
                window.location.href = "agradecimento.html";
            }, 1500);

        } else {

            status.textContent = "Erro ao enviar. Tente novamente.";
            btn.disabled = false;
            btn.textContent = "Enviar";

        }

    } catch {

        status.textContent = "Erro de conexão.";
        btn.disabled = false;
        btn.textContent = "Enviar";

    }
});