# Design System — Beach Tennis Platform

> Inspirado no template Sakai (PrimeVue), adaptado para Quasar/Vue 3.
> Use este documento como referência para gerar mockups HTML de qualquer página.

A documentação do quasar de referencia esta em https://quasar.dev/docs

---

## 1. Design System

### 1.1 Paleta de Cores

```css
/* Primárias */
--primary: #0284c7; /* azul-oceano */
--primary-light: #0ea5e9;
--primary-dark: #0369a1;

/* Secundárias */
--secondary: #f59e0b; /* âmbar-areia */
--secondary-light: #fbbf24;
--secondary-dark: #d97706;

/* Accent */
--accent: #06b6d4; /* ciano-água */

/* Semânticas */
--success: #22c55e;
--warning: #f59e0b;
--danger: #ef4444;
--info: #3b82f6;

/* Superfície (tipo Sakai) */
--surface-0: #ffffff;
--surface-50: #f8fafc;
--surface-100: #f1f5f9;
--surface-200: #e2e8f0;
--surface-300: #cbd5e1;
--surface-400: #94a3b8;
--surface-500: #64748b;
--surface-700: #334155;
--surface-900: #0f172a;

/* Sidebar */
--sidebar-bg: #1e293b; /* slate-800 */
--sidebar-text: #94a3b8;
--sidebar-active-bg: rgba(2, 132, 199, 0.15);
--sidebar-active-text: #0ea5e9;
--sidebar-hover: rgba(255, 255, 255, 0.05);
```

### 1.2 Tipografia

```
Fonte: Inter (Google Fonts)
Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Escala:
  --text-xs:   0.75rem  / 12px  — captions, labels auxiliares
  --text-sm:   0.875rem / 14px  — body secundário, table cells
  --text-base: 1rem     / 16px  — body principal
  --text-lg:   1.125rem / 18px  — subtítulos de cards
  --text-xl:   1.25rem  / 20px  — títulos de seção
  --text-2xl:  1.5rem   / 24px  — page titles
  --text-3xl:  1.875rem / 30px  — stat numbers
  --text-4xl:  2.25rem  / 36px  — hero numbers

Pesos:
  400 — normal (body)
  500 — medium (labels)
  600 — semibold (subtítulos)
  700 — bold (títulos, botões)
```

### 1.3 Espaçamento

```
Base: 4px
Escala: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
(equivalente ao sistema Quasar: xs=4, sm=8, md=16, lg=24, xl=32)
```

### 1.4 Border Radius

```
--radius-sm:   6px    — badges, chips pequenos
--radius-md:   10px   — inputs, botões
--radius-lg:   14px   — cards
--radius-xl:   20px   — cards hero, modals
--radius-full: 9999px — avatares, pills
```

### 1.5 Sombras

```
--shadow-sm:  0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md:  0 4px 12px rgba(0,0,0,0.08)
--shadow-lg:  0 8px 24px rgba(0,0,0,0.10)
--shadow-xl:  0 16px 40px rgba(0,0,0,0.12)
--shadow-card: 0 2px 8px rgba(0,0,0,0.06), 0 0 1px rgba(0,0,0,0.04)
```

### 1.6 Tokens de Componentes

#### Botão Principal

```
background: var(--primary)
color: #fff
border-radius: var(--radius-md)
padding: 8px 20px
font-weight: 600
font-size: 14px
hover: background var(--primary-dark)
transition: all 0.2s ease
shadow: var(--shadow-sm) em hover
```

#### Botão Outline

```
background: transparent
border: 1.5px solid var(--primary)
color: var(--primary)
border-radius: var(--radius-md)
hover: background rgba(2,132,199,0.06)
```

#### Input

```
border: 1.5px solid var(--surface-200)
border-radius: var(--radius-md)
padding: 10px 14px
font-size: 14px
background: var(--surface-0)
focus-border: var(--primary)
focus-shadow: 0 0 0 3px rgba(2,132,199,0.1)
label-color: var(--surface-500)
icon-color: var(--surface-400)
```

#### Card

```
background: var(--surface-0)
border-radius: var(--radius-lg)
border: 1px solid var(--surface-100)
shadow: var(--shadow-card)
padding: 20px 24px
```

#### Chip / Badge de Status

```
draft:      background #fef3c7, color #92400e  (amber-100 / amber-800)
open:       background #dcfce7, color #166534  (green-100 / green-800)
ongoing:    background #dbeafe, color #1e40af  (blue-100 / blue-800)
finished:   background #f1f5f9, color #475569  (surface-100 / surface-600)
```

#### Stat Card Gradientes

```
blue:   linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)
purple: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)
green:  linear-gradient(135deg, #22c55e 0%, #16a34a 100%)
amber:  linear-gradient(135deg, #f59e0b 0%, #d97706 100%)
```

---

## 2. Layouts

### 2.1 AuthLayout

```
Estrutura:
  - Tela cheia dividida em 2 colunas (desktop) / 1 coluna (mobile)
  - Coluna esquerda [40%]: painel decorativo
      background: linear-gradient(160deg, #0f172a 0%, #0284c7 100%)
      conteúdo: logo + tagline centralizada
      ícone de raquete (sports_tennis) grande, decorativo
  - Coluna direita [60%]: formulário centralizado
      background: var(--surface-50)
      card centralizado, max-width: 440px
      border-radius: var(--radius-xl)
      shadow: var(--shadow-xl)

Mobile: apenas a coluna direita, background: surface-50
```

### 2.2 MainLayout (área do jogador)

```
Estrutura:
  Header:
    height: 60px
    background: var(--surface-0)
    border-bottom: 1px solid var(--surface-100)
    shadow: var(--shadow-sm)
    conteúdo: [logo+nome] --- [avatar+nome+logout]
    cor do título: var(--surface-700)

  Sidebar (drawer):
    width: 260px
    background: var(--sidebar-bg)  /* #1e293b */
    topo: logo "Beach Tennis" com ícone branco
    itens: icon + label
    item ativo: background var(--sidebar-active-bg), cor var(--sidebar-active-text),
                barra lateral esquerda 3px var(--primary)
    item hover: background var(--sidebar-hover)
    border-radius dos itens: var(--radius-md)
    margem horizontal: 12px

  Content Area:
    background: var(--surface-50)
    padding: 24px
    min-height: calc(100vh - 60px)
```

### 2.3 ArenaAdminLayout

```
Estrutura:
  Header:
    igual ao MainLayout
    título: nome da arena (cor: surface-700)
    right: [notificações badge] + [separator] + [avatar+nome] + [logout]

  Sidebar:
    width: 280px
    background: var(--sidebar-bg)
    topo (80px): logo da arena (avatar rounded 72px) + nome da arena + "Beach Tennis Manager"
    separator com opacidade
    seção "MENU PRINCIPAL" (uppercase, letter-spacing)
    itens: icon + label com active state igual ao MainLayout
    rodapé: botão "← Minhas Arenas"

  Content:
    background: var(--surface-50)
    padding: 24px
```

---

## 3. Páginas

### 3.1 Login

```
Layout: AuthLayout

Coluna decorativa:
  - Ícone sports_tennis centralizado (120px, branco)
  - Título: "Beach Tennis Platform" (text-3xl, bold, branco)
  - Subtítulo: "Gerencie sua arena com eficiência" (text-sm, branco/70%)
  - Dots decorativos flutuantes no fundo (círculos brancos, opacity 0.05)

Card do formulário:
  - Logo/Ícone no topo (sports_tennis, primary, 48px)
  - Título: "Bem-vindo de volta" (text-2xl, bold, surface-900)
  - Subtítulo: "Entre na sua conta para continuar" (text-sm, surface-500)
  - Separador visual (16px)
  - Campo E-mail (ícone: email)
  - Campo Senha (ícone: lock, toggle visibilidade)
  - Link "Esqueceu a senha?" alinhado à direita (text-xs, primary)
  - Botão "Entrar" full-width (primary, bold)
  - Divider "ou" sutil
  - Link para cadastro: "Não tem conta? Cadastre-se" (centrado)

Estados:
  - Loading: spinner no botão, campos disabled
  - Erro: banner vermelho suave no topo do card (icon error + mensagem)
```

### 3.2 Register

```
Layout: AuthLayout (mesma coluna decorativa)

Card do formulário:
  - Ícone person_add (primary, 48px)
  - Título: "Criar Conta" (text-2xl, bold)
  - Subtítulo: "Junte-se à plataforma de Beach Tennis" (text-sm, surface-500)
  - Campo Nome Completo (ícone: person)
  - Campo E-mail (ícone: email)
  - Campo Senha (ícone: lock, toggle)
    - Barra de força da senha abaixo (fraca/média/forte)
  - Campo Confirmar Senha (ícone: check_circle)
  - Botão "Criar Conta" full-width (primary)
  - Link "Já tem conta? Faça login" (centrado)

Estados: igual ao Login
```

### 3.3 Home / Índice (IndexPage)

```
Layout: MainLayout

Seções:
  1. Banner de boas-vindas
     background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%)
     border-radius: radius-xl
     padding: 40px
     conteúdo: "Olá, {nome}! 👋" + subtítulo + CTA "Explorar Arenas"

  2. Grid 3 colunas — Atalhos rápidos
     - Card "Minhas Arenas" (ícone sports_tennis, azul)
     - Card "Explorar Arenas" (ícone explore, ciano)
     - Card "Meu Perfil" (ícone person, amber)
     cada card: hover com lift + sombra

  3. Seção "Arenas que você participa"
     - Lista horizontal com scroll
     - Card compacto por arena (logo + nome + cidade + chip "Jogador")
     - Estado vazio: ilustração simples + CTA

Nota: Página ainda sem conteúdo real — usar como oportunidade de redesign completo.
```

### 3.4 Minhas Arenas (ArenaPage)

```
Layout: MainLayout

Header da página:
  - Título "Minhas Arenas" (text-2xl, bold, surface-900)
  - Subtítulo "Gerencie suas unidades" (text-sm, surface-500)
  - Botão "Nova Arena" (primary, icon: add, alinhado à direita)

Grade de cards (3 colunas em desktop, 2 em tablet, 1 em mobile):
  Card de Arena:
    border-radius: radius-lg
    border-top: 3px solid var(--primary)  [accent top border — estilo Sakai]
    shadow: shadow-card
    hover: translateY(-3px) + shadow-md

    Topo do card:
      padding: 20px
      linha: [avatar/logo 48px rounded] + [nome bold] + [cidade com ícone location_on]

    Rodapé do card (bg: surface-50, border-top: surface-100):
      padding: 12px 16px
      botões: [Excluir (ghost, danger)] + [Editar (ghost, primary)] + [Gerenciar (primary, filled)]

Estado vazio:
  Card centralizado, border: 2px dashed surface-200, bg: surface-50
  Ícone add_business (80px, surface-300)
  Título + texto descritivo + CTA "Cadastrar Primeira Arena"

Modal "Nova/Editar Arena":
  max-width: 480px
  border-radius: radius-xl
  Header: avatar icon (primary) + título + botão fechar
  Separator
  Campos:
    - Nome da Arena *
    - Cidade
    - Logo (file input com preview inline — avatar 80px rounded)
  Rodapé: [Cancelar (ghost)] + [Salvar (primary)]
```

### 3.5 Explorar Arenas (DiscoverArenasPage)

```
Layout: MainLayout

Header:
  - Título + subtítulo padrão

Barra de busca (card surface-0, shadow-sm):
  layout: [input nome 5/12] + [input cidade 5/12] + [botão buscar 2/12]
  border-radius: radius-lg
  padding: 16px 20px

Grid de resultados (4 colunas lg / 3 md / 2 sm / 1 xs):
  Card de Arena Pública:
    border-radius: radius-lg
    overflow: hidden
    hover: translateY(-4px) + shadow-lg

    Imagem/placeholder (height: 160px):
      - se tem logo: q-img ratio 16/9
      - se não: bg surface-100 + ícone sports_tennis (64px, surface-300)

    Corpo:
      padding: 16px
      nome (text-lg, bold, surface-900) — truncated
      linha: ícone location_on (12px, primary) + cidade (text-sm, surface-500)

    Rodapé:
      padding: 8px 16px 16px
      botão "Ver Arena" outline full-width

Estados:
  Loading: grid de 8 skeleton cards (pulse animation)
  Vazio: ícone search_off + mensagem + sugestão de resetar filtros
```

### 3.6 Arena Pública — Perfil (ArenaPublicPage)

```
Layout: MainLayout

Seção Hero (card com overflow hidden):
  background: linear-gradient(160deg, #0f172a 60%, var(--primary) 100%)
  height: 320px
  conteúdo centralizado:
    - Avatar da arena (140px, rounded, shadow branca, border 4px white)
    - Nome da arena (text-4xl, bold, branco)
    - Cidade (text-lg, branco/70%, ícone location_on)

Abaixo do hero (padding: 32px 40px):
  Grid 8/4 (desktop) ou stacked (mobile):

  Coluna esquerda [8]:
    Título "Sobre a Arena" + texto descritivo
    Tags de características (chips outline): Torneios Ativos, Comunidade, Níveis

  Coluna direita [4]:
    Card de inscrição (border: 1.5px solid surface-200, radius-lg, bg: surface-50):

      [Se não registrado]:
        Ícone sports_tennis (primary, 48px)
        Título: "Quer jogar aqui?"
        Subtítulo descritivo
        Botão "Registrar-se" (primary, full-width, lg)

      [Se já registrado]:
        Ícone check_circle (success, 48px)
        Título: "Você é jogador desta arena!" (success)
        Mini perfil: nome, nível, cidade (bg white, border, radius-md)
        Botão "Editar Perfil" (primary)
        Botão "Voltar" (ghost, grey)

Seção Stats (3 colunas):
  - Jogadores: card bg-teal-50, número teal-700
  - Torneios: card bg-indigo-50, número indigo-700
  - Rankings: card bg-amber-50, número amber-700

Modal de Registro/Edição de Jogador:
  max-width: 480px
  Header: avatar (primary/edit icon) + título + nome da arena + fechar
  Campos: Nome*, Apelido, [Gênero | Nível] lado a lado, Cidade
  Rodapé: [Cancelar] + [Confirmar (primary)]
```

### 3.7 Dashboard da Arena (ArenaDashboardPage)

```
Layout: ArenaAdminLayout

Header da página:
  - "Dashboard" (text-2xl, bold, surface-900)
  - "Visão geral da sua arena {nome}" (text-sm, surface-500)
  - Botão "Novo Torneio" (primary, icon add)

4 Stat Cards (row, 1/4 cada, shadow-md):
  Estrutura interna:
    - Label uppercase (text-xs, branco/80%, letter-spacing)
    - Número (text-4xl, bold, branco)
    - Ícone decorativo (48px, absolute bottom-right, branco/20%)
    - border-radius: radius-lg
    - hover: translateY(-4px)
  Gradientes:
    [1] Total Torneios → azul (primary)
    [2] Jogadores      → roxo
    [3] Torneios Ativos → verde
    [4] Mensagens      → âmbar

Grid inferior 8/4:

  [8] Card "Atividade Recente":
    Header: título + link "Ver todos"
    separator
    Lista de atividades:
      item: [avatar history (blue-50 bg)] + [mensagem bold + caption de tempo]
    Estado vazio: ícone hourglass_empty + texto

  [4] Card "Acesso Rápido":
    3 botões outline full-width, alinhados à esquerda:
      - emoji_events "Novo Torneio"
      - add_circle "Cadastrar Jogador"
      - tune "Ajustar Categorias"
    padding entre botões: 8px

Modal "Novo Torneio":
  max-width: 520px
  Header: avatar emoji_events (primary) + "Novo Torneio" + fechar
  Campos:
    - Nome do Torneio * (ícone emoji_events)
    - [Tipo | Status] lado a lado
    - Info hint azul suave: dica sobre Rascunho
  Rodapé: [Cancelar] + [Criar Torneio (primary, bold)]
```

### 3.8 Torneios da Arena (ArenaTournamentsPage)

```
Layout: ArenaAdminLayout

Header: título "Torneios" + subtítulo + botão "Novo Torneio"

Card tabela (shadow-card, radius-lg):
  Colunas: Nome | Tipo | Status | Ações

  Coluna Tipo:
    chip outline primary (text-xs, bold)
    labels: "Grupos + Mata-mata" / "Mata-mata" / "Liga"

  Coluna Status:
    chip filled (text-xs, bold, branco):
      draft   → âmbar
      open    → verde
      ongoing → azul
      finished → cinza

  Coluna Ações:
    [editar (ghost, grey-600)] + [excluir (ghost, danger)]
    tooltips em hover

  Estado vazio (sem torneios):
    ícone emoji_events (80px, surface-300)
    "Nenhum torneio criado ainda"
    CTA "Criar Primeiro Torneio"

  Loading: skeleton rows (pulse)

Modal criar/editar: igual ao do Dashboard
```

### 3.9 Jogadores da Arena (ArenaPlayersPage)

```
Layout: ArenaAdminLayout

Header: "Jogadores" + "Gerencie os jogadores da arena" + botão "Novo Jogador"

[Estado atual — implementação futura]:
Card centralizado com estado vazio:
  ícone people (80px, surface-300)
  "Nenhum jogador cadastrado"
  texto descritivo
  botão "Cadastrar Jogador" (outline, primary)

[Futuro — quando implementado]:
  Tabela/Grid com:
    Avatar inicial | Nome | Apelido | Nível (chip) | Gênero | Cidade | Ações
  Filtros: busca por nome + filtro por nível
```

### 3.10 Configurações da Arena (ArenaSettingsPage)

```
Layout: ArenaAdminLayout

Layout da página: coluna centralizada, max-width: 680px

Seção "Informações Básicas":
  Card (shadow-card, radius-lg):
    título "Informações Básicas" (text-lg, semibold, surface-700)
    separator
    campos: Nome da Arena * | Cidade

Seção "Branding & Logo":
  Card separado:
    título "Branding & Logo"
    separator
    layout: [avatar preview 100px rounded] + [file input com hint]
    hint: "JPG, PNG — Máx 2MB"

Seção "Zona de Perigo" (futuro):
  Card com borda danger/20%, bg danger/5%
  Botão "Excluir Arena" (outline, danger)

Rodapé:
  botão "Salvar Alterações" alinhado à direita (primary, bold)
```

---

## 4. Fluxos de UX

### 4.1 Fluxo de Autenticação

```
[/login] → credenciais → POST /login
  ✓ sucesso → redirect [/]
  ✗ erro    → banner de erro no card (sem reload)

[/register] → formulário → POST /register
  ✓ sucesso → redirect [/] (já logado)
  ✗ erro    → banner de erro

[logout] → dialog de confirmação → POST /logout → redirect [/login]
```

### 4.2 Fluxo Dono de Arena

```
[/arenas] → ver arenas
  → "Nova Arena" → modal → POST → card aparece na grid
  → "Editar"     → modal preenchido → PUT → card atualizado
  → "Excluir"    → dialog confirm → DELETE → card some
  → "Gerenciar"  → redirect [/admin/arena/{id}/dashboard]

[dashboard] → stats + atividades
  → "Novo Torneio" → modal → POST
  → "Cadastrar Jogador" → [/players] (futuro)
  → "Ajustar Categorias" → (futuro)

[/tournaments] → tabela
  → criar/editar via modal
  → excluir via dialog

[/settings] → formulário → PUT (salva logo separado se enviado)
```

### 4.3 Fluxo Jogador

```
[/discover] → busca arenas
  → "Ver Arena" → [/arena/{id}/public]
    → [não registrado] → "Registrar-se" → modal → POST /register
    → [registrado]     → "Editar Perfil" → modal pré-preenchido → PUT
```

---

## 5. Padrões de Interação

### Feedback visual

```
Ações destrutivas (delete):  SEMPRE dialog de confirmação
Mutations bem-sucedidas:     q-notify positivo, posição "top", ícone check_circle
Erros de API:                q-notify negativo com mensagem do backend
Loading states:              spinner no botão (not page-level), campos disabled
```

### Animações

```
Cards hover:     translateY(-3px) + shadow, transition 0.2s ease
Botões hover:    escurecer cor 10%, shadow sutil, transition 0.15s
Modais:          fade + scale (0.95 → 1), duration 200ms
Page transitions: fade simples, 150ms
```

### Responsividade

```
Breakpoints (Quasar):
  xs: < 600px   — 1 coluna, sidebar collapse
  sm: 600–1024px — 2 colunas, sidebar overlay
  md: 1024–1440px — 3 colunas, sidebar fixed
  lg: > 1440px  — layout full

Sidebar:
  lg+: sempre visível (show-if-above)
  sm/md: drawer com overlay, botão hamburguer no header
```

---

## 6. Referência de Ícones (Material Icons)

```
Navegação:    home, explore, sports_tennis, dashboard
Arenas:       add_business, location_on, edit, delete, settings
Torneios:     emoji_events, add, tune, play_circle
Jogadores:    people, person, person_add, bar_chart
Auth:         email, lock, person, check_circle, logout
Sistema:      notifications, search, search_off, hourglass_empty,
              image, cloud_upload, check, close, menu, arrow_back
Status:       check_circle (ok), error (falha), info, warning
```

---

## 7. Instruções para Geração de HTML

Ao gerar HTML a partir deste design system, siga estas regras:

1. **Importar Inter**: `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">`
2. **Importar Material Icons**: `<link href="https://fonts.googleapis.com/icon?family=Material+Icons">`
3. **Definir CSS variables** no `:root` conforme seção 1.1
4. **Sidebar escura**: fundo `#1e293b`, textos `#94a3b8`, item ativo com fundo `rgba(2,132,199,0.15)` e borda esquerda `3px solid #0284c7`
5. **Cards**: sempre `border: 1px solid var(--surface-100)` + `border-radius: 14px` + `box-shadow: var(--shadow-card)`
6. **Inputs**: border `1.5px solid #e2e8f0`, radius `10px`, focus com outline `rgba(2,132,199,0.15)`
7. **Simular dados ficticios** para deixar o mockup realista (nomes, cidades, números)
8. **Estado ativo do menu lateral**: destacar o item correspondente à página sendo mockada
9. **Mobile-first**: garantir que o layout colapsa corretamente abaixo de 600px
