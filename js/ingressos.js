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
                <td><button class="btn btn-sm btn-outline-danger" onclick="cancelarIngresso(${i})"><i class="bi bi-x-circle"></i></button></td>
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

function cancelarIngresso(index) {
    if (confirm('Cancelar este ingresso?')) {
        const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];
        ingressos.splice(index, 1);
        localStorage.setItem('ingressos', JSON.stringify(ingressos));
        carregarIngressos();
    }
}

function mostrarAlerta(titulo, mensagem) {
    document.getElementById('modalTitulo').textContent = titulo;
    document.getElementById('modalMensagem').textContent = mensagem;
    new bootstrap.Modal(document.getElementById('modalAlerta')).show();
}
