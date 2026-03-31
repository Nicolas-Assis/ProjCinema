document.addEventListener('DOMContentLoaded', function() {
    carregarSessoesSelect();
    carregarIngressos();
    const urlParams = new URLSearchParams(window.location.search);
    const sessaoId = urlParams.get('sessao');
    if (sessaoId) {
        document.getElementById('sessao').value = sessaoId;
        mostrarDetalhesSessao();
    }
});

document.getElementById('cpf').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
    e.target.value = v;
});

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
    return d.toLocaleDateString('pt-BR') + ' as ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function carregarSessoesSelect() {
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const select = document.getElementById('sessao');
    select.innerHTML = '<option value="">Selecione uma sessao...</option>';
    sessoes.forEach(s => {
        select.innerHTML += `<option value="${s.id}">${getNomeFilme(s.filmeId)} - ${getNomeSala(s.salaId)} - ${formatarDataHora(s.dataHora)}</option>`;
    });
}

document.getElementById('sessao').addEventListener('change', mostrarDetalhesSessao);

function mostrarDetalhesSessao() {
    const sessaoId = document.getElementById('sessao').value;
    const detalhes = document.getElementById('detalhesSessao');
    const info = document.getElementById('infoSessao');

    if (sessaoId) {
        const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        const s = sessoes.find(x => x.id == sessaoId);
        if (s) {
            info.innerHTML = `
                <p class="mb-1"><i class="bi bi-film"></i> <strong>Filme:</strong> ${getNomeFilme(s.filmeId)}</p>
                <p class="mb-1"><i class="bi bi-door-open"></i> <strong>Sala:</strong> ${getNomeSala(s.salaId)}</p>
                <p class="mb-1"><i class="bi bi-calendar"></i> <strong>Data/Hora:</strong> ${formatarDataHora(s.dataHora)}</p>
                <p class="mb-1"><i class="bi bi-translate"></i> <strong>Idioma:</strong> ${s.idioma} | <strong>Formato:</strong> ${s.formato}</p>
                <p class="mb-0"><i class="bi bi-cash"></i> <strong>Preco:</strong> R$ ${parseFloat(s.preco).toFixed(2)}</p>
            `;
            detalhes.classList.remove('hidden');
        }
    } else {
        detalhes.classList.add('hidden');
    }
}

function carregarIngressos() {
    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    const lista = document.getElementById('listaIngressos');
    const vazia = document.getElementById('mensagemVazia');
    document.getElementById('contadorIngressos').textContent = ingressos.length;
    lista.innerHTML = '';

    if (ingressos.length === 0) {
        vazia.classList.remove('hidden');
        document.querySelector('.table-responsive').classList.add('hidden');
    } else {
        vazia.classList.add('hidden');
        document.querySelector('.table-responsive').classList.remove('hidden');
        ingressos.forEach((ing, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${ing.nomeCliente}</strong><br><small class="text-muted">${ing.cpf}</small></td>
                <td>${ing.nomeFilme}</td>
                <td><span class="badge bg-primary">${ing.assento}</span></td>
                <td><span class="badge bg-secondary">${ing.tipoPagamento}</span></td>
                <td><span class="badge bg-success">R$ ${parseFloat(ing.valor).toFixed(2)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="abrirModalEditar(${i})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="abrirModalDeletar(${i})" title="Cancelar">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            lista.appendChild(tr);
        });
    }
}

function limparFormulario() {
    document.getElementById('detalhesSessao').classList.add('hidden');
}

document.getElementById('formVenda').addEventListener('submit', function(e) {
    e.preventDefault();
    const sessaoId = document.getElementById('sessao').value;
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const sessao = sessoes.find(s => s.id == sessaoId);

    if (!sessao) { mostrarAlerta('Erro!', 'Sessao nao encontrada!'); return; }

    const ingresso = {
        id: Date.now(),
        sessaoId: sessaoId,
        nomeCliente: document.getElementById('nomeCliente').value.trim(),
        cpf: document.getElementById('cpf').value.trim(),
        assento: document.getElementById('assento').value.trim().toUpperCase(),
        tipoPagamento: document.getElementById('tipoPagamento').value,
        nomeFilme: getNomeFilme(sessao.filmeId),
        nomeSala: getNomeSala(sessao.salaId),
        dataHora: sessao.dataHora,
        valor: sessao.preco,
        dataVenda: new Date().toISOString()
    };

    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    if (ingressos.some(i => i.sessaoId == sessaoId && i.assento == ingresso.assento)) {
        mostrarAlerta('Atencao!', 'Assento ja vendido!');
        return;
    }

    ingressos.push(ingresso);
    localStorage.setItem('ingressos', JSON.stringify(ingressos));

    document.getElementById('ticketCliente').textContent = ingresso.nomeCliente;
    document.getElementById('ticketFilme').textContent = ingresso.nomeFilme;
    document.getElementById('ticketSala').textContent = ingresso.nomeSala;
    document.getElementById('ticketDataHora').textContent = formatarDataHora(ingresso.dataHora);
    document.getElementById('ticketAssento').textContent = ingresso.assento;
    document.getElementById('ticketValor').textContent = 'R$ ' + parseFloat(ingresso.valor).toFixed(2);

    new bootstrap.Modal(document.getElementById('modalIngresso')).show();
    this.reset();
    document.getElementById('detalhesSessao').classList.add('hidden');
    carregarIngressos();
});

let indexParaDeletar = null;
let indexParaEditar = null;

function abrirModalDeletar(index) {
    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    const ing = ingressos[index];
    
    if (ing) {
        indexParaDeletar = index;
        document.getElementById('deleteCliente').textContent = ing.nomeCliente;
        document.getElementById('deleteFilme').textContent = ing.nomeFilme;
        document.getElementById('deleteAssento').textContent = ing.assento;
        new bootstrap.Modal(document.getElementById('modalDeletar')).show();
    }
}

document.getElementById('btnConfirmarDelete').addEventListener('click', function() {
    if (indexParaDeletar !== null) {
        const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
        ingressos.splice(indexParaDeletar, 1);
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        indexParaDeletar = null;
        bootstrap.Modal.getInstance(document.getElementById('modalDeletar')).hide();
        carregarIngressos();
        mostrarSucesso('Ingresso cancelado com sucesso!');
    }
});

function abrirModalEditar(index) {
    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    const ing = ingressos[index];
    
    if (ing) {
        indexParaEditar = index;
        document.getElementById('editIndex').value = index;
        document.getElementById('editNomeCliente').value = ing.nomeCliente;
        document.getElementById('editCpf').value = ing.cpf;
        document.getElementById('editAssento').value = ing.assento;
        document.getElementById('editTipoPagamento').value = ing.tipoPagamento;
        document.getElementById('editFilmeInfo').textContent = `${ing.nomeFilme} - ${formatarDataHora(ing.dataHora)}`;
        new bootstrap.Modal(document.getElementById('modalEditar')).show();
    }
}

document.getElementById('btnSalvarEdicao').addEventListener('click', function() {
    const index = parseInt(document.getElementById('editIndex').value);
    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
    
    if (index >= 0 && index < ingressos.length) {
        const novoAssento = document.getElementById('editAssento').value.trim().toUpperCase();
        const assentoAtual = ingressos[index].assento;
        const sessaoId = ingressos[index].sessaoId;
        
        // Verifica se o novo assento já está ocupado (exceto o atual)
        if (novoAssento !== assentoAtual && ingressos.some(i => i.sessaoId == sessaoId && i.assento == novoAssento)) {
            mostrarAlerta('Atenção!', 'Este assento já está ocupado nesta sessão!');
            return;
        }
        
        ingressos[index].nomeCliente = document.getElementById('editNomeCliente').value.trim();
        ingressos[index].cpf = document.getElementById('editCpf').value.trim();
        ingressos[index].assento = novoAssento;
        ingressos[index].tipoPagamento = document.getElementById('editTipoPagamento').value;
        
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        bootstrap.Modal.getInstance(document.getElementById('modalEditar')).hide();
        carregarIngressos();
        mostrarSucesso('Ingresso atualizado com sucesso!');
    }
});

// Máscara de CPF para o modal de edição
document.getElementById('editCpf').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{3})/, '$1.$2');
    e.target.value = v;
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
