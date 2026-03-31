document.addEventListener('DOMContentLoaded', function() {
    carregarFilmes();
});

function carregarFilmes() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const listaFilmes = document.getElementById('listaFilmes');
    const mensagemVazia = document.getElementById('mensagemVazia');
    document.getElementById('contadorFilmes').textContent = filmes.length;
    listaFilmes.innerHTML = '';

    if (filmes.length === 0) {
        mensagemVazia.classList.remove('hidden');
        document.querySelector('.table-responsive').classList.add('hidden');
    } else {
        mensagemVazia.classList.add('hidden');
        document.querySelector('.table-responsive').classList.remove('hidden');
        filmes.forEach((filme, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${filme.titulo}</strong></td>
                <td>${filme.genero}</td>
                <td><span class="badge bg-secondary">${filme.classificacao}</span></td>
                <td>${filme.duracao} min</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalEditar(${index})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="abrirModalDeletar(${index})" title="Excluir">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            listaFilmes.appendChild(tr);
        });
    }
}

document.getElementById('formFilme').addEventListener('submit', function(e) {
    e.preventDefault();
    const filme = {
        id: Date.now(),
        titulo: document.getElementById('titulo').value.trim(),
        genero: document.getElementById('genero').value.trim(),
        descricao: document.getElementById('descricao').value.trim(),
        classificacao: document.getElementById('classificacao').value,
        duracao: parseInt(document.getElementById('duracao').value),
        dataEstreia: document.getElementById('dataEstreia').value
    };
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    filmes.push(filme);
    localStorage.setItem('filmes', JSON.stringify(filmes));
    mostrarAlerta('Sucesso!', 'Filme cadastrado com sucesso!');
    this.reset();
    carregarFilmes();
});

let indexParaDeletar = null;
let indexParaEditar = null;

function abrirModalDeletar(index) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const filme = filmes[index];
    
    if (filme) {
        indexParaDeletar = index;
        document.getElementById('deleteTitulo').textContent = filme.titulo;
        document.getElementById('deleteGenero').textContent = filme.genero;
        document.getElementById('deleteDuracao').textContent = filme.duracao + ' min';
        new bootstrap.Modal(document.getElementById('modalDeletar')).show();
    }
}

document.getElementById('btnConfirmarDelete').addEventListener('click', function() {
    if (indexParaDeletar !== null) {
        const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        filmes.splice(indexParaDeletar, 1);
        localStorage.setItem('filmes', JSON.stringify(filmes));
        indexParaDeletar = null;
        bootstrap.Modal.getInstance(document.getElementById('modalDeletar')).hide();
        carregarFilmes();
        mostrarSucesso('Filme excluído com sucesso!');
    }
});

function abrirModalEditar(index) {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const filme = filmes[index];
    
    if (filme) {
        indexParaEditar = index;
        document.getElementById('editIndex').value = index;
        document.getElementById('editTitulo').value = filme.titulo;
        document.getElementById('editGenero').value = filme.genero;
        document.getElementById('editDescricao').value = filme.descricao || '';
        document.getElementById('editClassificacao').value = filme.classificacao;
        document.getElementById('editDuracao').value = filme.duracao;
        document.getElementById('editDataEstreia').value = filme.dataEstreia;
        new bootstrap.Modal(document.getElementById('modalEditar')).show();
    }
}

document.getElementById('btnSalvarEdicao').addEventListener('click', function() {
    const index = parseInt(document.getElementById('editIndex').value);
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    
    if (index >= 0 && index < filmes.length) {
        filmes[index].titulo = document.getElementById('editTitulo').value.trim();
        filmes[index].genero = document.getElementById('editGenero').value.trim();
        filmes[index].descricao = document.getElementById('editDescricao').value.trim();
        filmes[index].classificacao = document.getElementById('editClassificacao').value;
        filmes[index].duracao = parseInt(document.getElementById('editDuracao').value);
        filmes[index].dataEstreia = document.getElementById('editDataEstreia').value;
        
        localStorage.setItem('filmes', JSON.stringify(filmes));
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        carregarFilmes();
        mostrarSucesso('Filme atualizado com sucesso!');
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
