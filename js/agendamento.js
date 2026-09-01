/* =========================================================
   Agendamento da reunião de alinhamento
   Recebe o aceite via sessionStorage e monta a mensagem final.
   ========================================================= */

(function () {
  'use strict';

  var CFG = window.TRIZOS || {};
  var HORARIOS = CFG.horarios || ['09:00', '10:00', '14:00', '16:00'];
  var DIAS_OK = CFG.diasAtendidos || [1, 2, 3, 4, 5];

  var MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  var SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
                'Quinta-feira', 'Sexta-feira', 'Sábado'];

  /* ---------- dados do aceite ---------- */
  var aceite = null;
  try {
    aceite = JSON.parse(sessionStorage.getItem('aceiteProposta'));
  } catch (e) {
    aceite = null;
  }

  if (!aceite) {
    window.location.replace('index.html#proximos-passos');
    return;
  }

  document.getElementById('s-nome').textContent = aceite.nome;
  document.getElementById('s-escopo').textContent = aceite.escopo;
  document.getElementById('s-pagamento').textContent = aceite.pagamento;

  if (aceite.observacoes) {
    document.getElementById('s-obs').textContent = aceite.observacoes;
    document.getElementById('row-obs').hidden = false;
  }

  /* ---------- estado ---------- */
  var hoje = new Date();
  var hojeZero = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  var mesVista = hoje.getMonth();
  var anoVista = hoje.getFullYear();
  var dataEscolhida = null;
  var horaEscolhida = null;

  var elDias = document.getElementById('dias');
  var elMesAno = document.getElementById('mes-ano');
  var elPrev = document.getElementById('prev');
  var elNext = document.getElementById('next');
  var elHorarios = document.getElementById('horarios');
  var elResumo = document.getElementById('resumo-data');
  var elConfirmar = document.getElementById('confirmar');

  /* ---------- calendário ---------- */
  function desenharCalendario() {
    elDias.innerHTML = '';
    elMesAno.textContent = MESES[mesVista] + ' ' + anoVista;

    // sem navegar para meses já passados
    elPrev.disabled = (anoVista === hoje.getFullYear() && mesVista === hoje.getMonth());

    var primeiroDiaSemana = new Date(anoVista, mesVista, 1).getDay();
    var totalDias = new Date(anoVista, mesVista + 1, 0).getDate();

    for (var v = 0; v < primeiroDiaSemana; v++) {
      var vazio = document.createElement('div');
      vazio.className = 'day is-empty';
      elDias.appendChild(vazio);
    }

    for (var d = 1; d <= totalDias; d++) {
      elDias.appendChild(criarDia(d));
    }
  }

  function criarDia(numero) {
    var data = new Date(anoVista, mesVista, numero);
    var el = document.createElement('div');
    el.className = 'day';
    el.textContent = numero;

    var passado = data < hojeZero;
    var foraDaAgenda = DIAS_OK.indexOf(data.getDay()) === -1;

    if (passado || foraDaAgenda) {
      el.classList.add('is-off');
      el.setAttribute('aria-disabled', 'true');
      return el;
    }

    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');

    function escolher() {
      var anterior = elDias.querySelector('.day.is-on');
      if (anterior) anterior.classList.remove('is-on');
      el.classList.add('is-on');

      dataEscolhida = data;
      horaEscolhida = null;
      desenharHorarios();
      atualizarResumo();
    }

    el.addEventListener('click', escolher);
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); escolher(); }
    });

    return el;
  }

  /* ---------- horários ---------- */
  function desenharHorarios() {
    elHorarios.innerHTML = '';

    HORARIOS.forEach(function (hora) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'slot';
      btn.textContent = hora;
      btn.disabled = !dataEscolhida;

      btn.addEventListener('click', function () {
        var anterior = elHorarios.querySelector('.slot.is-on');
        if (anterior) anterior.classList.remove('is-on');
        btn.classList.add('is-on');

        horaEscolhida = hora;
        atualizarResumo();
      });

      elHorarios.appendChild(btn);
    });
  }

  /* ---------- resumo ---------- */
  function dataPorExtenso(data) {
    return SEMANA[data.getDay()] + ', ' + data.getDate() +
           ' de ' + MESES[data.getMonth()].toLowerCase() +
           ' de ' + data.getFullYear();
  }

  function atualizarResumo() {
    if (dataEscolhida && horaEscolhida) {
      elResumo.textContent = dataPorExtenso(dataEscolhida) + ' às ' + horaEscolhida;
      elResumo.classList.remove('is-idle');
      elConfirmar.disabled = false;
    } else if (dataEscolhida) {
      elResumo.textContent = dataPorExtenso(dataEscolhida) + ' — escolha o horário';
      elResumo.classList.add('is-idle');
      elConfirmar.disabled = true;
    } else {
      elResumo.textContent = 'Selecione um dia e um horário';
      elResumo.classList.add('is-idle');
      elConfirmar.disabled = true;
    }
  }

  /* ---------- navegação ---------- */
  elPrev.addEventListener('click', function () {
    mesVista--;
    if (mesVista < 0) { mesVista = 11; anoVista--; }
    desenharCalendario();
  });

  elNext.addEventListener('click', function () {
    mesVista++;
    if (mesVista > 11) { mesVista = 0; anoVista++; }
    desenharCalendario();
  });

  /* ---------- confirmação ---------- */
  elConfirmar.addEventListener('click', function () {
    if (!dataEscolhida || !horaEscolhida) return;

    var linhas = [
      'ACEITE DA PROPOSTA',
      '',
      'Nome: ' + aceite.nome,
      'Contratação: ' + aceite.escopo,
      'Pagamento do site: ' + aceite.pagamento,
      '',
      'Confirmo que li e concordo com o escopo, o prazo e as condições da proposta.',
      '',
      'REUNIÃO DE ALINHAMENTO',
      dataPorExtenso(dataEscolhida) + ' às ' + horaEscolhida
    ];

    if (aceite.observacoes) {
      linhas.push('', 'Observações:', aceite.observacoes);
    }

    sessionStorage.removeItem('aceiteProposta');

    window.location.href = 'https://wa.me/' + CFG.whatsapp +
                           '?text=' + encodeURIComponent(linhas.join('\n'));
  });

  /* ---------- início ---------- */
  desenharCalendario();
  desenharHorarios();
  atualizarResumo();

})();
