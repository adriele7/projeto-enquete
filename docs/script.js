const API_BASE_URL = 'https://projeto-enquete-rvu2.onrender.com'; 
const opcoesVotoContainer = document.getElementById('opcoes-voto');
const listaResultadosContainer = document.getElementById('lista-resultados');

async function fetchVotos() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/votos`);
        const votos = await response.json();
        
        opcoesVotoContainer.innerHTML = '';
        listaResultadosContainer.innerHTML = ''; 

        votos.forEach(item => {
            const button = document.createElement('button');
            button.className = 'opcao-voto';
            
            button.onclick = () => votar(item.opcao_nome);
            
            button.innerHTML = `<span>${item.opcao_nome}</span>`;
            
            opcoesVotoContainer.appendChild(button);
        });

        votos.forEach(item => {
            const resultadoItem = document.createElement('div');
            resultadoItem.className = 'resultado-item';
            
            resultadoItem.innerHTML = `
                <p><strong>${item.opcao_nome}:</strong></p>
                <span class="placar">${item.total_votos} Votos</span>
            `;
            
            listaResultadosContainer.appendChild(resultadoItem);
        });

    } catch (error) {
        console.error('Erro ao buscar a enquete:', error);
        opcoesVotoContainer.innerHTML = '<p style="color: red;">Erro ao carregar a enquete. Verifique o servidor.</p>';
    }
}

async function votar(opcao) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/votar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ opcao: opcao }),
        });

        if (response.ok) {
            console.log(`Voto registrado para: ${opcao}`);
            fetchVotos(); 
        } else {
            alert('Falha ao registrar voto. Opção inválida ou erro no servidor.');
        }

    } catch (error) {
        console.error('Erro de rede ao votar:', error);
        alert('Erro de conexão com o servidor.');
    }
}

fetchVotos();