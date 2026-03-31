document.addEventListener('DOMContentLoaded', function() {
    carregarFilmesSelect();
    carregarSalasSelect();
    carregarSessoes();
});

function carregarFilmesSelect() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const select = document.getElementById('filme');
    select.innerHTML = '<option value="">Selecione um filme...</option>';
    filmes.forEach(f => {
        select.innerHTML += `<option value="${f.id}">${f.titulo} (${f.duracao} min)</option>`;
    });
}

function carregarSalasSelect() {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const select = document.getElementById('sala');
    select.innerHTML = '<option value="">Selecione uma sala...</option>';
    salas.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.nome} (${s.tipo} - ${s.capacidade} lugares)</option>`;
    });
}

function getNomeFilme(id) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const f = filmes.find(x => x.id == id);
    return f ? f.titulo : 'N/A';
}

function getNomeSala(id) {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const s = salas.find(x => x.id == id);
    return s ? s.nome : 'N/A';
}

function formatarDataHora(dt) {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function carregarSessoes() {
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const lista = document.getElementById('listaSessoes');
    const vazia = document.getElementById('mensagemVazia');
    document.getElementById('contadorSessoes').textContent = sessoes.length;
    lista.innerHTML = '';

    if (sessoes.length === 0) {
        vazia.classList.remove('hidden');
        document.querySelector('.table-responsive').classList.add('hidden');
    } else {
        vazia.classList.add('hidden');
        document.querySelector('.table-responsive').classList.remove('hidden');
        sessoes.forEach((s, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${getNomeFilme(s.filmeId)}</strong></td>
                <td>${getNomeSala(s.salaId)}</td>
                <td>${formatarDataHora(s.dataHora)}</td>
                <td><span class="badge bg-success">R$ ${parseFloat(s.preco).toFixed(2)}</span></td>
                <td><span class="badge bg-info">${s.idioma}</span> <span class="badge bg-secondary">${s.formato}</span></td>
                <td><button class="btn btn-sm btn-outline-danger" onclick="excluirSessao(${i})"><i class="bi bi-trash"></i></button></td>
            `;
            lista.appendChild(tr);
        });
    }
}

document.getElementById('formSessao').addEventListener('submit', function(e) {
    e.preventDefault();
    const sessao = {
        id: Date.now(),
        filmeId: document.getElementById('filme').value,
        salaId: document.getElementById('sala').value,
        dataHora: document.getElementById('dataHora').value,
        preco: parseFloat(document.getElementById('preco').value),
        idioma: document.getElementById('idioma').value,
        formato: document.getElementById('formato').value
    };
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    sessoes.push(sessao);
    localStorage.setItem('sessoes', JSON.stringify(sessoes));
    mostrarAlerta('Sucesso!', 'Sessão cadastrada!');
    this.reset();
    carregarSessoes();
});

function excluirSessao(index) {
    if (confirm('Excluir esta sessão?')) {
        const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        sessoes.splice(index, 1);
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        carregarSessoes();
    }
}

function mostrarAlerta(titulo, mensagem) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensagem').textContent = mensagem;
    new bootstrap.Modal(document.getElementById('modalAlerta')).show();
}
