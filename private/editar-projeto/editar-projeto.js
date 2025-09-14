const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA_ATUACAO = 'area_atuacao';
const TABELA_ESTAGIO = 'estagio_de_dev';
const TABELA_PROJETO = 'projeto';

let projetoId = null;

document.addEventListener('DOMContentLoaded', async function () {
    projetoId = obterIdDaUrl();
    await mostrar(); // carrega dropdowns
    if (projetoId) {
        await carregarProjeto(projetoId);
    }
});

function obterIdDaUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Carrega dados do projeto e preenche os campos
async function carregarProjeto(id) {
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${id}`, {
        method: 'GET',
        headers: {
            'apikey': SUPABASE_API_KEY,
            'Authorization': `Bearer ${SUPABASE_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    const dados = await resposta.json();
    const projeto = dados[0];

    document.getElementById("inputTitle").value = projeto.nome;
    document.getElementById("inputDesc").value = projeto.descricao;
    document.getElementById("metaDeFundos").value = projeto.meta_de_fundos;
    document.getElementById("fundosAtuais").value = projeto.fundos_atuais;

    document.getElementById("areaDeAtuacao").value = projeto.area_atuacao_id;
    document.getElementById("devEstagio").value = projeto.estagio_dev_id;
}

// Carrega dropdowns de área e estágio
async function mostrar() {
    const [resArea, resEstagio] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/${TABELA_ATUACAO}?order=id.asc`, {
            headers: { 'apikey': SUPABASE_API_KEY, 'Authorization': `Bearer ${SUPABASE_API_KEY}` }
        }),
        fetch(`${SUPABASE_URL}/rest/v1/${TABELA_ESTAGIO}?order=id.asc`, {
            headers: { 'apikey': SUPABASE_API_KEY, 'Authorization': `Bearer ${SUPABASE_API_KEY}` }
        })
    ]);

    const [dadosArea, dadosEstagio] = await Promise.all([resArea.json(), resEstagio.json()]);
    criarDropdown("areaDeAtuacao", dadosArea, "area");
    criarDropdown("devEstagio", dadosEstagio, "estagio");
}

function criarDropdown(id, lista, campoTexto) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    for (const item of lista) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item[campoTexto];
        select.appendChild(option);
    }
}

function atualizar() {
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

    const projeto = {
        nome: inputTitulo,
        descricao: inputDesc,
        estagio_dev_id: selectEstagio,
        meta_de_fundos: inputMeta,
        fundos_atuais: inputFundos,
        area_atuacao_id: selectArea,
    }

    postar(projeto);
}

async function postar(projeto) {
    projetoId = parseInt(obterIdDaUrl())
    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${TABELA_PROJETO}?id=eq.${projetoId}`, {
        method: 'PATCH',
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
    alert("Projeto editado com sucesso.")
}

function editarMembros() {
    window.location.href = `editar-membros.html?id=${obterIdDaUrl()}`;
}