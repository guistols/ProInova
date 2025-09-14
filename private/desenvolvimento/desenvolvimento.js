const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA = 'estagio_de_dev';
let idEditando = null;



function salvar() {

  const estagioDevInput = document.getElementById("nomeEstagio").value

  const estagioDev = {
    estagio : estagioDevInput
  }

  if (!estagioDevInput) {
    alert("O campo 'Estágio' é obrigatório!");
    return;
  }

  if (idEditando) {
    atualizarEstagio(idEditando, estagioDev);
  } else {
    criarEstagio(estagioDev);
  }

}

async function criarEstagio(estagioDev) {
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(estagioDev)
  });

  const dados = await resposta.json();
  console.log(dados);
  mostrarEstagio();
}


async function mostrarEstagio() {

  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?order=id.asc`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const dados = await resposta.json();
  criarTabela(dados);
  console.log(dados);
}

function criarTabela(lista) {
  $("#corpoTabelaEstagio").empty();

  for (const linha of lista) {

    const acoesLinha =
      `<div class="acoes">
        <div class="acoes-coluna">
            <a onclick="editarEstagio(${linha.id})"><i id="caneta" class="fa-solid fa-pen"></i></a>
        </div>
        <div class="acoes-coluna">
       <a onclick="apagarEstagio(${linha.id})"><i id="lixeira" class="fa-solid fa-trash"></i></a>
        </div>
    </div>`;

    let linhaTr = $("<tr/>");
    linhaTr.append($('<td/>').html(acoesLinha));
    linhaTr.append($("<td/>").html(linha.id));
    linhaTr.append($("<td/>").html(linha.estagio));
    $("#corpoTabelaEstagio").append(linhaTr);
  }
}

async function apagarEstagio(idelete) {

  const deletarEstagio = confirm("Deseja deletar o estágio?")

  if(deletarEstagio===false){
    return;
  }
 
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/projeto?estagio_dev_id=eq.${idelete}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const projetos = await resposta.json();

  if (projetos.length > 0) {
    alert("Não é possível apagar este estágio de desenvolvimento pois ele está sendo utilizado em projetos.");
    return;
  }

  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${idelete}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  mostrarEstagio();
  console.log("apagado com sucesso.")
}

async function editarEstagio(id) {

  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const dados = await resposta.json();
  const estagio = dados[0];

  document.getElementById("nomeEstagio").value = estagio.estagio;
  idEditando = id;

  document.getElementById("btnCadastrar").innerText = "Salvar Edição";

}

async function atualizarEstagio(id, estagioAtualizado) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(estagioAtualizado)
  });

  idEditando = null;
  document.getElementById("btnCadastrar").innerText = "Cadastrar estágio";
  document.getElementById("nomeEstagio").value = "";
  mostrarEstagio();
}
