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
                <td>
                    <button class="btn btn-sm btn-outline-warning me-1" onclick="abrirModalEditar(${i})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="abrirModalDeletar(${i})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
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

let indexParaDeletar = null;
let indexParaEditar = null;

function abrirModalDeletar(index) {
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const sessao = sessoes[index];
    
    if (sessao) {
        indexParaDeletar = index;
        document.getElementById('deleteFilme').textContent = getNomeFilme(sessao.filmeId);
        document.getElementById('deleteSala').textContent = getNomeSala(sessao.salaId);
        document.getElementById('deleteDataHora').textContent = formatarDataHora(sessao.dataHora);
        new bootstrap.Modal(document.getElementById('modalDeletar')).show();
    }
}

document.getElementById('btnConfirmarDelete').addEventListener('click', function() {
    if (indexParaDeletar !== null) {
        const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        sessoes.splice(indexParaDeletar, 1);
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        indexParaDeletar = null;
        bootstrap.Modal.getInstance(document.getElementById('modalDeletar')).hide();
        carregarSessoes();
        mostrarSucesso('Sessão excluída com sucesso!');
    }
});

function carregarFilmesSelectEditar() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const select = document.getElementById('editFilme');
    select.innerHTML = '';
    filmes.forEach(f => {
        select.innerHTML += `<option value="${f.id}">${f.titulo} (${f.duracao} min)</option>`;
    });
}

function carregarSalasSelectEditar() {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const select = document.getElementById('editSala');
    select.innerHTML = '';
    salas.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.nome} (${s.tipo} - ${s.capacidade} lugares)</option>`;
    });
}

function abrirModalEditar(index) {
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const sessao = sessoes[index];
    
    if (sessao) {
        indexParaEditar = index;
        carregarFilmesSelectEditar();
        carregarSalasSelectEditar();
        
        document.getElementById('editIndex').value = index;
        document.getElementById('editFilme').value = sessao.filmeId;
        document.getElementById('editSala').value = sessao.salaId;
        document.getElementById('editDataHora').value = sessao.dataHora;
        document.getElementById('editPreco').value = sessao.preco;
        document.getElementById('editIdioma').value = sessao.idioma;
        document.getElementById('editFormato').value = sessao.formato;
        new bootstrap.Modal(document.getElementById('modalEditar')).show();
    }
}

document.getElementById('btnSalvarEdicao').addEventListener('click', function() {
    const index = parseInt(document.getElementById('editIndex').value);
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    
    if (index >= 0 && index < sessoes.length) {
        sessoes[index].filmeId = document.getElementById('editFilme').value;
        sessoes[index].salaId = document.getElementById('editSala').value;
        sessoes[index].dataHora = document.getElementById('editDataHora').value;
        sessoes[index].preco = parseFloat(document.getElementById('editPreco').value);
        sessoes[index].idioma = document.getElementById('editIdioma').value;
        sessoes[index].formato = document.getElementById('editFormato').value;
        
        localStorage.setItem('sessoes', JSON.stringify(sessoes));
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        carregarSessoes();
        mostrarSucesso('Sessão atualizada com sucesso!');
    }
});

function mostrarSucesso(mensagem) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '1100';
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-success text-white">
                <i class="bi bi-check-circle me-2"></i>
                <strong class="me-auto">Sucesso</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${mensagem}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function mostrarAlerta(titulo, mensagem) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensagem').textContent = mensagem;
    new bootstrap.Modal(document.getElementById('modalAlerta')).show();
}
