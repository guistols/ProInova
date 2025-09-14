const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA_PROJETO = 'projeto';
const TABELA_EQUIPE = 'equipe';


async function mostrarProjeto() {
    //metodo get
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?order=id.asc`, {
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
    $("#corpoTabelaProjetos").empty();

    for (const linha of lista) {

        const acoesLinha =
            `<div class="acoes">
        <div class="acoes-coluna">
            <a onclick="editarProjeto(${linha.id})"><i id="caneta" class="fa-solid fa-pen"></i></a>
        </div>
        <div class="acoes-coluna">
       <a onclick="apagarEquipe(${linha.id})"><i id="lixeira" class="fa-solid fa-trash"></i></a>
        </div>
    </div>`;

        let linhaTr = $("<tr/>");
        linhaTr.append($('<td/>').html(acoesLinha));
        linhaTr.append($("<td/>").html(linha.id));
        linhaTr.append($("<td/>").html(linha.nome));
        $("#corpoTabelaProjetos").append(linhaTr);
    }
}

async function apagarEquipe(idelete) {

    const deletarRegistro = confirm("Deseja deletar o projeto")

    if(deletarRegistro===false){
        return;
    }

    await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_EQUIPE}?projeto_id=eq.${idelete}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    apagarProjeto(idelete)
    console.log("equipe apagada com sucesso.")
}

async function apagarProjeto(idelete) {

    await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${idelete}`, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    mostrarProjeto();
    console.log("apagado com sucesso.")
}


function editarProjeto(id) {
    window.location.href = `editar-projeto.html?id=${id}`;
}
