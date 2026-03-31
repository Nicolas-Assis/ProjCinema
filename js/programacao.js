let todasSessoes = [];

document.addEventListener('DOMContentLoaded', function() {
    carregarFiltroFilmes();
    carregarSessoes();
});

document.getElementById('filtroFilme').addEventListener('change', aplicarFiltros);
document.getElementById('filtroData').addEventListener('change', aplicarFiltros);
document.getElementById('filtroIdioma').addEventListener('change', aplicarFiltros);

function carregarFiltroFilmes() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const select = document.getElementById('filtroFilme');
    filmes.forEach(f => {
        select.innerHTML += `<option value="${f.id}">${f.titulo}</option>`;
    });
}

function getFilme(id) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    return filmes.find(f => f.id == id) || { titulo: 'N/A', genero: '-', classificacao: '-', duracao: 0 };
}

function getSala(id) {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    return salas.find(s => s.id == id) || { nome: 'N/A', tipo: '-' };
}

function formatarData(dt) {
    return new Date(dt).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
}

function formatarHora(dt) {
    return new Date(dt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function getCorClassificacao(c) {
    const cores = { 'Livre': 'bg-success', '10 anos': 'bg-info', '12 anos': 'bg-primary', '14 anos': 'bg-warning text-dark', '16 anos': 'bg-orange', '18 anos': 'bg-danger' };
    return cores[c] || 'bg-secondary';
}

function carregarSessoes() {
    todasSessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    exibirSessoes(todasSessoes);
}

function aplicarFiltros() {
    let filtradas = todasSessoes;
    const filme = document.getElementById('filtroFilme').value;
    const data = document.getElementById('filtroData').value;
    const idioma = document.getElementById('filtroIdioma').value;
    if (filme) filtradas = filtradas.filter(s => s.filmeId == filme);
    if (data) filtradas = filtradas.filter(s => s.dataHora.split('T')[0] === data);
    if (idioma) filtradas = filtradas.filter(s => s.idioma === idioma);
    exibirSessoes(filtradas);
}

function limparFiltros() {
    document.getElementById('filtroFilme').value = '';
    document.getElementById('filtroData').value = '';
    document.getElementById('filtroIdioma').value = '';
    exibirSessoes(todasSessoes);
}

function exibirSessoes(sessoes) {
    const lista = document.getElementById('listaSessoes');
    const vazia = document.getElementById('mensagemVazia');
    document.getElementById('contadorSessoes').textContent = `${sessoes.length} ${sessoes.length === 1 ? 'sessao' : 'sessoes'}`;
    lista.innerHTML = '';

    if (sessoes.length === 0) {
        vazia.classList.remove('hidden');
        lista.classList.add('hidden');
    } else {
        vazia.classList.add('hidden');
        lista.classList.remove('hidden');
        sessoes.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
        sessoes.forEach(s => {
            const f = getFilme(s.filmeId);
            const sala = getSala(s.salaId);
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-4';
            col.innerHTML = `
                <div class="card card-sessao h-100">
                    <div class="card-header bg-dark text-white"><h5 class="mb-0">${f.titulo}</h5></div>
                    <div class="card-body">
                        <div class="mb-3">
                            <span class="badge ${getCorClassificacao(f.classificacao)} me-1">${f.classificacao}</span>
                            <span class="badge bg-secondary me-1">${f.genero}</span>
                            <span class="badge bg-light text-dark">${f.duracao} min</span>
                        </div>
                        <p class="mb-2"><i class="bi bi-door-open text-success"></i> <strong>${sala.nome}</strong> <span class="badge border">${sala.tipo}</span></p>
                        <p class="mb-2"><i class="bi bi-calendar text-primary"></i> ${formatarData(s.dataHora)}</p>
                        <p class="mb-2"><i class="bi bi-clock text-warning"></i> <strong>${formatarHora(s.dataHora)}</strong></p>
                        <p class="mb-3"><span class="badge ${s.idioma === 'Dublado' ? 'bg-info' : 'bg-warning text-dark'}">${s.idioma}</span> <span class="badge bg-secondary">${s.formato}</span></p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="preco-grande text-success">R$ ${parseFloat(s.preco).toFixed(2)}</span>
                            <a href="venda-ingressos.html?sessao=${s.id}" class="btn btn-danger"><i class="bi bi-ticket-perforated"></i> Comprar</a>
                        </div>
                    </div>
                </div>
            `;
            lista.appendChild(col);
        });
    }
}
