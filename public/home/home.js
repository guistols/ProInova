const SUPABASE_URL = 'https://nvbvyejyvljxjkkjbwyz.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YnZ5ZWp5dmxqeGpra2pid3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODUxNjEsImV4cCI6MjA2NTg2MTE2MX0.UtX4yvPPuIlME1mASyT7KfBfv6GATx7zUN2a5jDIj1A';
const TABELA_PROJETO = 'projeto';
 
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
    criarDivProjeto(dados)
    console.log(dados)
   
}
 
 
function criarDivProjeto(dados) {
    const container = document.querySelector(".cards-container");
 
    for (let i = 0; i < dados.length; i++) {
        const projeto = dados[i]
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML =
            `<h2>${projeto.nome}</h2><div class="botao-desc"><p>${projeto.descricao}</p><a onclick="verMaisProjeto(${projeto.id})">Ver mais</a></div>`
 
        container.appendChild(div)
    }
 
}
 
function verMaisProjeto(id){
    console.log(id)
    window.location.href = `ver-mais.html?id=${id}`;
}