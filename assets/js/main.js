// STUDIO TUTS — comportamento do site
(function () {
  var WHATSAPP = '5519991545577';

  // Menu no celular
  var botao = document.querySelector('.nav-toggle');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto);
      botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('aberto')) botao.click();
    });
  }

  // Animação de entrada
  var itens = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    itens.forEach(function (el) { obs.observe(el); });
  } else {
    itens.forEach(function (el) { el.classList.add('visivel'); });
  }

  // Formulário de contato: monta a mensagem e abre o WhatsApp
  var form = document.getElementById('form-contato');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var assunto = form.assunto.value;
      var mensagem = form.mensagem.value.trim();
      var texto = 'Olá, Studio TUTS! Meu nome é ' + nome + '.\n' +
                  'Assunto: ' + assunto + '\n\n' + mensagem;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  // Ano no rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
