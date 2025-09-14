const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA = 'area_atuacao';
let idEditando = null;

//busca o valor do input área e chama as funções de atualizar e criar
function salvar() {
  const areaDevInput = document.getElementById("nomeArea").value

  const areaAtuacao = {
    area: areaDevInput
  }

  if (!areaDevInput) {
    alert("O campo 'Nome da Área' é obrigatório!");
    return;
  }

  if (idEditando) {
    atualizarArea(idEditando, areaAtuacao);
  } else {
    criarArea(areaAtuacao);
  }

}
// faz o post no banco da área
async function criarArea(areaAtuacao) {
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    //lê em formato json
    body: JSON.stringify(areaAtuacao)
  });

  const dados = await resposta.json();
  console.log(dados);
  mostrarArea();
}

//busca o elemento no banco e chama a função criar tabela
async function mostrarArea() {
  //metodo get
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

//cria a lista com botões de editar e excluir áreas de atuação
function criarTabela(lista) {
  $("#corpoTabelaAreas").empty();

  for (const linha of lista) {

    const acoesLinha =
      `<div class="acoes">
        <div class="acoes-coluna">
            <a onclick="editarArea(${linha.id})"><i id="caneta" class="fa-solid fa-pen"></i></a>
        </div>
        <div class="acoes-coluna">
       <a onclick="apagarArea(${linha.id})"><i id="lixeira" class="fa-solid fa-trash"></i></a>
        </div>
    </div>`;

    let linhaTr = $("<tr/>");
    linhaTr.append($('<td/>').html(acoesLinha));
    linhaTr.append($("<td/>").html(linha.id));
    linhaTr.append($("<td/>").html(linha.area));
    $("#corpoTabelaAreas").append(linhaTr);
  }
}

async function apagarArea(idelete) {

  const deletarArea = confirm("Deseja deletar área de atuação?")

  if(deletarArea===false){
    return;
  }

  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/projeto?area_atuacao_id=eq.${idelete}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const projetos = await resposta.json();

  if (projetos.length > 0) {
    alert("Não é possível apagar esta área de atuação pois ela está sendo utilizada em projetos.");
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
  mostrarArea();
  console.log("apagado com sucesso.")
}

async function editarArea(id) {

  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: 'GET',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const dados = await resposta.json();
  const area = dados[0];

  document.getElementById("nomeArea").value = area.area;
  idEditando = id;

  document.getElementById("btnCadastrar").innerText = "Salvar Edição";

}

//atualiza a tabela
async function atualizarArea(id, areaAtualizada) {
  await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(areaAtualizada)
  });

  idEditando = null;
  document.getElementById("btnCadastrar").innerText = "Cadastrar Área";
  document.getElementById("nomeArea").value = "";
  mostrarArea();
}
