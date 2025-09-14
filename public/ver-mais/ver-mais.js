const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA_PROJETO = 'projeto';
const TABELA_EQUIPE = 'equipe';
const TABELA_ESTAGIO = 'estagio_de_dev';
const TABELA_AREA = 'area_atuacao';

let projetoId = parseInt(obterIdDaUrl())

function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function mostrarProjeto() {
    //metodo get projeto
     const respostaProjeto = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${projetoId}`,{
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    //metodo get pega o id da area
     const respostaIdArea = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${projetoId}`,{
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })
    // joga pra variavel o id da area
    const idArea = await respostaIdArea.json()
    const projetoIdArea = idArea[0].area_atuacao_id
    //resposta da area (nome)
    const respostaArea = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_AREA}?id=eq.${projetoIdArea}&order=id.asc`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const respostaIdEstagio = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${projetoId}`,{
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })

    const idEstagio = await respostaIdEstagio.json();
    const projetoIdEstagio = idEstagio[0].estagio_dev_id;

     const respostaEquipe = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_EQUIPE}?projeto_id=eq.${projetoId}&order=id.asc`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    const respostaEstagio = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_ESTAGIO}?id=eq.${projetoIdEstagio}&order=id.asc`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const dadosArea = await respostaArea.json();
    const dadosEstagio = await respostaEstagio.json();
    const dadosEquipe = await respostaEquipe.json();
    const dadosProjeto = await respostaProjeto.json();
    verMaisProjeto(dadosProjeto[0],dadosEquipe,dadosEstagio[0],dadosArea[0])
    console.log(dadosEstagio)
    console.log(dadosProjeto)
    console.log(dadosEquipe)
}

async function verMaisProjeto(dadosProjeto,dadosEquipe,dadosEstagio,dadosArea){
    const tituloArea = document.getElementById("titulo-area")
    tituloArea.innerHTML = `${dadosProjeto.nome}`

    const area = document.getElementById("area")
    area.innerHTML = `Área: ${dadosArea.area}`

    const descricao = document.getElementById("descricao")
    descricao.innerHTML = `${dadosProjeto.descricao}`

    const estagio = document.getElementById("estagio")
    estagio.innerHTML = `${dadosEstagio.estagio}`

    const fundos_atual = document.getElementById("fundo-atual")
    fundos_atual.innerHTML = `Fundos atuais: R$ ${dadosProjeto.fundos_atuais}`
    const meta_fundos = document.getElementById("meta-fundos")
    meta_fundos.innerHTML = `Meta de fundos: R$ ${dadosProjeto.meta_de_fundos}`

    const membroH2 = document.getElementById("membro")

    for(let i = 0;i < dadosEquipe.length ; i++){
        const membro = dadosEquipe[i]        
        membroH2.innerHTML += `${membro.membro}<br/>`
    }

}

