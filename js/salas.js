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
                        <button class="btn btn-sm btn-outline-success me-1" onclick="abrirModalEditar(${index})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="abrirModalDeletar(${index})" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
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

let indexParaDeletar = null;
let indexParaEditar = null;

function abrirModalDeletar(index) {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const sala = salas[index];
    
    if (sala) {
        indexParaDeletar = index;
        document.getElementById('deleteNome').textContent = sala.nome;
        document.getElementById('deleteTipo').textContent = sala.tipo;
        document.getElementById('deleteCapacidade').textContent = sala.capacidade + ' lugares';
        new bootstrap.Modal(document.getElementById('modalDeletar')).show();
    }
}

document.getElementById('btnConfirmarDelete').addEventListener('click', function() {
    if (indexParaDeletar !== null) {
        const salas = JSON.parse(localStorage.getItem('salas')) || [];
        salas.splice(indexParaDeletar, 1);
        localStorage.setItem('salas', JSON.stringify(salas));
        indexParaDeletar = null;
        bootstrap.Modal.getInstance(document.getElementById('modalDeletar')).hide();
        carregarSalas();
        mostrarSucesso('Sala excluída com sucesso!');
    }
});

function abrirModalEditar(index) {
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const sala = salas[index];
    
    if (sala) {
        indexParaEditar = index;
        document.getElementById('editIndex').value = index;
        document.getElementById('editNomeSala').value = sala.nome;
        document.getElementById('editCapacidade').value = sala.capacidade;
        document.getElementById('editTipoSala').value = sala.tipo;
        new bootstrap.Modal(document.getElementById('modalEditar')).show();
    }
}

document.getElementById('btnSalvarEdicao').addEventListener('click', function() {
    const index = parseInt(document.getElementById('editIndex').value);
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    
    if (index >= 0 && index < salas.length) {
        salas[index].nome = document.getElementById('editNomeSala').value.trim();
        salas[index].capacidade = parseInt(document.getElementById('editCapacidade').value);
        salas[index].tipo = document.getElementById('editTipoSala').value;
        
        localStorage.setItem('salas', JSON.stringify(salas));
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        carregarSalas();
        mostrarSucesso('Sala atualizada com sucesso!');
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
