const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA = 'equipe';
let projetoId = parseInt(obterIdDaUrl())
let membroId = null;

function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function mostrarEquipe() {
    //metodo get
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?projeto_id=eq.${projetoId}&order=id.asc`, {
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
    $("#corpoTabelaEquipe").empty();

    for (const linha of lista) {

        const acoesLinha =
            `<div class="acoes">
          <div class="acoes-coluna">
              <a onclick="editarMembro(${linha.id})"><i id="caneta" class="fa-solid fa-pen"></i></a>
          </div>
          <div class="acoes-coluna">
         <a onclick="apagarMembro(${linha.id})"><i id="lixeira" class="fa-solid fa-trash"></i></a>
          </div>
      </div>`;

        let linhaTr = $("<tr/>");
        linhaTr.append($('<td/>').html(acoesLinha));
        linhaTr.append($("<td/>").html(linha.id));
        linhaTr.append($("<td/>").html(linha.membro));
        $("#corpoTabelaEquipe").append(linhaTr);
    }
}

async function salvar() {
    const inputMembro = document.getElementById("nomeMembro").value;

    if (!inputMembro) {
        alert("O campo 'Nome do Membro' é obrigatório!");
        return;
      }

    const membroUp = {
        membro: inputMembro,
    }
    console.log(membroUp)
    console.log(membroId)
    await postar(membroId, membroUp);
    await mostrarEquipe();
}

async function postar(id, membro) {
    projetoId = parseInt(obterIdDaUrl())


    if (!id) {
        alert("Selecione um membro para editar.");
        return;
    }


    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
        method: 'PATCH',
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
    alert("Membro editado com sucesso.")
}

async function editarMembro(id) {
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const dados = await resposta.json();
    const membro = dados[0];
    document.getElementById("nomeMembro").value = membro.membro;
    membroId = membro.id;
    console.log(dados);
}

async function apagarMembro(id) {

    const confirmaDeletar = confirm("Deseja mesmo excluir?")

    if(!confirmaDeletar){
        return
    }

    await fetch(`${SUPABASE_URL}/rest/v1/${TABELA}?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    mostrarEquipe();
    console.log("Apagado com sucesso.")
}