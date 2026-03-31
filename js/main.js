document.addEventListener('DOMContentLoaded', function() {
    const filmes = JSON.parse(localStorage.getItem('filmes')) || [];
    const salas = JSON.parse(localStorage.getItem('salas')) || [];
    const sessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
    const ingressos = JSON.parse(localStorage.getItem('ingressos')) || [];

    document.getElementById('totalFilmes').textContent = filmes.length;
    document.getElementById('totalSalas').textContent = salas.length;
    document.getElementById('totalSessoes').textContent = sessoes.length;
    document.getElementById('totalIngressos').textContent = ingressos.length;
});
