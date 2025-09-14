const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA_ATUACAO = 'area_atuacao';
const TABELA_ESTAGIO = 'estagio_de_dev'
const TABELA_PROJETO = 'projeto'
const TABELA_EQUIPE = 'equipe'
let quantidade;


document.addEventListener('DOMContentLoaded', function () {
  const inputNumero = document.getElementById('qtdMembros');
  const container = document.getElementById('membros-container');

  function gerarCampos(qtd) {
    const num = Math.min(parseInt(qtd) || 0, 6);
    quantidade = num;
    container.innerHTML = '';

    for (let i = 1; i <= num; i++) {
      const div = document.createElement('div');
      div.className = 'membro';

      const label = document.createElement('label');
      label.setAttribute('for', `membro-${i}`);
      label.textContent = `Membro ${i}:`;

      const input = document.createElement('input');
      input.type = 'text';
      input.id = `membro-${i}`;

      div.appendChild(label);
      div.appendChild(input);
      container.appendChild(div);
    }
  }

  // Gera os campos ao carregar a página com o valor atual do input
  gerarCampos(inputNumero.value);

  // Gera os campos sempre que o valor do input mudar
  inputNumero.addEventListener('input', function () {
    gerarCampos(this.value);
  });
  mostrar();
});

async function salvar() {
  const inputTitulo = document.getElementById("inputTitle").value;
  const selectArea = document.getElementById("areaDeAtuacao").value;
  const inputMeta = document.getElementById("metaDeFundos").value;
  const inputFundos = document.getElementById("fundosAtuais").value;
  const selectEstagio = document.getElementById("devEstagio").value;
  const inputDesc = document.getElementById("inputDesc").value;

  if (!inputTitulo) {
    alert("O campo 'Título' é obrigatório!");
    return;
  }
  if (!inputMeta) {
    alert("O campo 'Meta de fundos' é obrigatório!");
    return;
  }
  if (!inputFundos) {
    alert("O campo 'Fundos atuais' é obrigatório!");
    return;
  }
  if (!inputDesc) {
    alert("O campo 'Descrição' é obrigatório!");
    return;
  }

  for (let i = 1; i <= quantidade; i++) {
    if (!document.getElementById(`membro-${i}`).value) {
      alert(`O campo 'Membro ${i}' é obrigatório.`)
      return;
    }
  }

  const projeto = {
    nome: inputTitulo,
    descricao: inputDesc,
    estagio_dev_id: selectEstagio,
    meta_de_fundos: inputMeta,
    fundos_atuais: inputFundos,
    area_atuacao_id: selectArea,
  }

  criarProjeto(projeto);
}

async function criarProjeto(projeto) {
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(projeto)
  });

  const dados = await resposta.json();
  console.log(dados);

  if (dados.length > 0) {
    criarMembros(dados[0].id);
  }

}

function criarMembros(idProjeto) {
  for (let i = 1; i <= quantidade; i++) {
    let inputMembro = document.getElementById(`membro-${i}`);
    let equipe = {
      membro: inputMembro.value,
      projeto_id: idProjeto,
    }
    postarMembro(equipe)
  }
  alert("Projeto criado com sucesso!");
  window.location.href = `meus-projetos.html`
}

async function postarMembro(membro) {
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_EQUIPE}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(membro)
  });

  const dados = await resposta.json();
  console.log(dados);
}

//faz o get nas duas tabelas e traz os resultados
async function mostrar() {
  const respostaArea = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_ATUACAO}?order=id.asc`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const respostaEstagio = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_ESTAGIO}?order=id.asc`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const dadosArea = await respostaArea.json();
  const dadosEstagio = await respostaEstagio.json();
  criarDropdownArea(dadosArea);
  criarDropdownEstagio(dadosEstagio);
  console.log(dadosArea);
  console.log(dadosEstagio);
}
// cria o dropdown da area
function criarDropdownArea(lista) {

  $("#areaDeAtuacao").empty();

  for (const linha of lista) {
    let option = $("<option/>").val(linha.id).text(linha.area);
    $("#areaDeAtuacao").append(option);
  }
}
//cria o dropdown do estagio
function criarDropdownEstagio(lista) {

  $("#devEstagio").empty();

  for (const linha of lista) {
    let option = $("<option/>").val(linha.id).text(linha.estagio);
    $("#devEstagio").append(option);
  }
}