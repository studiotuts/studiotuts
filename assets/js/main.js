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

  // Políticas de privacidade em janelas.
  // Cada política tem um endereço próprio: privacidade.html#tuts-vex, #corre-certo,
  // #controle-de-contas e #10estressa (abre a janela direto, útil para a Google Play).
  var janelas = document.querySelectorAll('dialog.modal');
  if (janelas.length) {
    var suportaDialog = typeof janelas[0].showModal === 'function';
    var abrir = function (id, gravarEndereco) {
      var d = document.getElementById(id);
      if (!d || d.tagName !== 'DIALOG') return;
      if (!suportaDialog) { d.setAttribute('open', ''); d.scrollIntoView(); return; }
      if (!d.open) d.showModal();
      d.querySelector('.modal-corpo').scrollTop = 0;
      document.body.classList.add('modal-aberto');
      if (gravarEndereco && location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    };
    var limparEndereco = function () {
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    };

    document.querySelectorAll('[data-politica]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        abrir(a.getAttribute('data-politica'), true);
      });
    });

    janelas.forEach(function (d) {
      d.addEventListener('close', function () {
        document.body.classList.remove('modal-aberto');
        limparEndereco();
      });
      // Fecha ao clicar fora da janela
      d.addEventListener('click', function (e) {
        if (e.target === d) d.close();
      });
      d.querySelectorAll('[data-fechar]').forEach(function (b) {
        b.addEventListener('click', function () { d.close(); });
      });
      var copiar = d.querySelector('[data-copiar]');
      if (copiar) {
        copiar.addEventListener('click', function () {
          var url = location.origin + location.pathname + '#' + d.id;
          var rotulo = copiar.querySelector('span');
          var feito = function () {
            rotulo.textContent = 'Link copiado!';
            setTimeout(function () { rotulo.textContent = 'Copiar link'; }, 2000);
          };
          if (navigator.clipboard) navigator.clipboard.writeText(url).then(feito, function () { prompt('Copie o link:', url); });
          else prompt('Copie o link:', url);
        });
      }
    });

    var pelaUrl = function () {
      var id = decodeURIComponent(location.hash.slice(1));
      if (id) abrir(id, false);
      else janelas.forEach(function (d) { if (d.open) d.close(); });
    };
    window.addEventListener('popstate', pelaUrl);
    window.addEventListener('hashchange', pelaUrl);
    pelaUrl();
  }

  // Ano no rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
