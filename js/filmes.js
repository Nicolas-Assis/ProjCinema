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
                <td><button class="btn btn-sm btn-outline-danger" onclick="excluirFilme(${index})"><i class="bi bi-trash"></i></button></td>
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

function excluirFilme(index) {
    if (confirm('Excluir este filme?')) {
        const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
        filmes.splice(index, 1);
        localStorage.setItem('filmes', JSON.stringify(filmes));
        carregarFilmes();
    }
}

function mostrarAlerta(titulo, mensagem) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensagem').textContent = mensagem;
    new bootstrap.Modal(document.getElementById('modalAlerta')).show();
}
