# Proposta Comercial — Nathalia Mazzei

Site de apresentação da proposta comercial da **Trizos Company** para Nathalia Mazzei.
HTML/CSS/JS puro, sem build, pronto para deploy no Vercel.

## Estrutura

```
index.html               a proposta (11 seções) + formulário de aceite
agendamento.html         calendário da reunião de alinhamento
style.css                design system (preto / off-white / dourado)
js/config.js             WhatsApp, horários e dias atendidos
js/agendamento.js        lógica do calendário e da mensagem final
assets/logo-branca.png   logotipo horizontal — uso sobre fundo escuro
assets/logo-escura.png   logotipo horizontal — uso sobre fundo claro
assets/simbolo.png       símbolo isolado — favicon e usos compactos
```

## Fluxo de conversão

```
index.html  →  formulário de aceite
                ├── "Ainda tenho dúvidas"  →  WhatsApp direto
                └── qualquer contratação   →  agendamento.html
                                                └── dia + horário → WhatsApp
```

Os dados do aceite trafegam entre as páginas por `sessionStorage` e chegam
ao WhatsApp junto com o horário escolhido.

## Configuração

Tudo que muda com frequência está em `js/config.js`:

| Campo | O que faz |
|---|---|
| `whatsapp` | Número que recebe o aceite. Formato DDI+DDD+número, só dígitos |
| `horarios` | Horários oferecidos para a reunião |
| `diasAtendidos` | Dias da semana atendidos (0 = domingo … 6 = sábado) |

## Rodar localmente

Abra `index.html` no navegador. Sem dependências.

## Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) → **New Project**
2. Importe o repositório `proposta-nathalia`
3. Framework Preset: **Other** · Build Command: vazio · Output Directory: vazio
4. **Deploy**

O link gerado (`https://proposta-nathalia.vercel.app`) é o que se envia para a cliente.
