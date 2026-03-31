document.addEventListener('DOMContentLoaded', function() {
    carregarSalas();
});

function getIconeTipo(tipo) {
    const icones = { '2D': 'bi-display', '3D': 'bi-badge-3d', 'IMAX': 'bi-projector' };
    return icones[tipo] || 'bi-tv';
}

function getCorTipo(tipo) {
    const cores = { '2D': 'bg-primary', '3D': 'bg-warning text-dark', 'IMAX': 'bg-danger' };
    return cores[tipo] || 'bg-secondary';
}

function carregarSalas() {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const listaSalas = document.getElementById('listaSalas');
    const mensagemVazia = document.getElementById('mensagemVazia');
    document.getElementById('contadorSalas').textContent = salas.length;
    listaSalas.innerHTML = '';

    if (salas.length === 0) {
        mensagemVazia.classList.remove('hidden');
    } else {
        mensagemVazia.classList.add('hidden');
        salas.forEach((sala, index) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4 mb-3';
            col.innerHTML = `
                <div class="card card-sala h-100">
                    <div class="card-body text-center">
                        <i class="bi ${getIconeTipo(sala.tipo)} display-4 text-muted mb-3"></i>
                        <h5 class="card-title">${sala.nome}</h5>
                        <p><span class="badge ${getCorTipo(sala.tipo)}">${sala.tipo}</span></p>
                        <p><i class="bi bi-people"></i> ${sala.capacidade} lugares</p>
                    </div>
                    <div class="card-footer bg-transparent text-center">
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirSala(${index})"><i class="bi bi-trash"></i> Excluir</button>
                    </div>
                </div>
            `;
            listaSalas.appendChild(col);
        });
    }
}

document.getElementById('formSala').addEventListener('submit', function(e) {
    e.preventDefault();
    const sala = {
        id: Date.now(),
        nome: document.getElementById('nomeSala').value.trim(),
        capacidade: parseInt(document.getElementById('capacidade').value),
        tipo: document.getElementById('tipoSala').value
    };
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    salas.push(sala);
    localStorage.setItem('salas', JSON.stringify(salas));
    mostrarAlerta('Sucesso!', 'Sala cadastrada com sucesso!');
    this.reset();
    carregarSalas();
});

function excluirSala(index) {
    if (confirm('Excluir esta sala?')) {
        const salas = JSON.parse(localStorage.getItem('salas')) || [];
        salas.splice(index, 1);
        localStorage.setItem('salas', JSON.stringify(salas));
        carregarSalas();
    }
}

function mostrarAlerta(titulo, mensagem) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensagem').textContent = mensagem;
    new bootstrap.Modal(document.getElementById('modalAlerta')).show();
}
