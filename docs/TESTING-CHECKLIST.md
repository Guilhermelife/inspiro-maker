# ✅ Checklist de Testes PWA - Frases do Dia

## 🎯 Pré-teste

- [ ] App buildado com `npm run build`
- [ ] App rodando em HTTPS (produção) ou localhost (desenvolvimento)
- [ ] DevTools aberto (F12) com aba Console visível

---

## 📱 Teste 1: Manifest e Ícones

### Chrome DevTools
- [ ] Abrir DevTools → Application → Manifest
- [ ] Verificar que manifest.json carrega sem erros
- [ ] Conferir `name`: "Frases do Dia - Motivacionais & Reflexivas"
- [ ] Conferir `short_name`: "Frases do Dia"
- [ ] Conferir `theme_color`: "#3B82F6"
- [ ] Conferir `display`: "standalone"

### Ícones
- [ ] Verificar que todos os 9 ícones aparecem na lista
- [ ] Clicar em cada ícone e verificar se carrega (não deve dar 404)
- [ ] Verificar ícone maskable (purpose: "maskable")

---

## ⚙️ Teste 2: Service Worker

### Registro
- [ ] DevTools → Application → Service Workers
- [ ] Verificar que Service Worker está **"activated and running"**
- [ ] Conferir source: `/sw.js` ou similar
- [ ] Não deve haver erros no console

### Cache
- [ ] DevTools → Application → Cache Storage
- [ ] Verificar presença de caches:
  - [ ] `workbox-precache-v2-...` (arquivos estáticos)
  - [ ] `images-cache` (imagens)
  - [ ] `google-fonts-cache` (fontes)
- [ ] Abrir cada cache e verificar arquivos armazenados

### Offline Simulation
- [ ] DevTools → Network → marcar "Offline"
- [ ] Recarregar página (F5)
- [ ] App deve carregar normalmente
- [ ] Navegar para rota não cacheada (ex: `/teste`)
- [ ] Deve aparecer página offline personalizada

---

## 📲 Teste 3: Instalação - Android Chrome

### Prompt Automático
- [ ] Abrir app em Chrome Android (HTTPS)
- [ ] Aguardar 30 segundos de navegação
- [ ] Verificar se banner de instalação aparece
- [ ] Clicar em "Instalar"
- [ ] Verificar se dialog nativo do Android aparece

### Instalação Manual
- [ ] Menu (três pontos) → "Instalar app"
- [ ] Confirmar instalação
- [ ] Verificar ícone na tela inicial
- [ ] Abrir app da tela inicial
- [ ] App deve abrir em **tela cheia** (sem barra do navegador)

### Validações Pós-Instalação
- [ ] Ícone correto na tela inicial
- [ ] Nome "Frases do Dia" embaixo do ícone
- [ ] Splash screen aparece ao abrir (logo + fundo branco)
- [ ] Barra de status tem cor #3B82F6

---

## 🍎 Teste 4: Instalação - Safari iOS

### Prompt Customizado
- [ ] Abrir app em Safari iOS
- [ ] Banner de instalação customizado aparece
- [ ] Clicar em "Instalar"
- [ ] Modal com instruções iOS aparece
- [ ] Instruções são claras (3 passos)

### Instalação Manual
- [ ] Tocar no botão "Compartilhar" (quadrado com seta)
- [ ] Rolar lista e tocar "Adicionar à Tela de Início"
- [ ] Editar nome se necessário
- [ ] Tocar "Adicionar" (canto superior direito)

### Validações Pós-Instalação
- [ ] Ícone aparece na tela inicial
- [ ] Nome "Frases do Dia" embaixo do ícone
- [ ] Splash screen aparece ao abrir
- [ ] App abre sem barra do Safari
- [ ] Barra de status integrada (não sobreposta)

---

## 🔄 Teste 5: Atualização de Versão

### Simular Nova Versão
- [ ] Fazer alteração no código (ex: mudar cor de botão)
- [ ] Buildar novamente: `npm run build`
- [ ] Fazer deploy da nova versão

### Verificar Prompt de Atualização
- [ ] Abrir app na versão antiga
- [ ] Service Worker detecta nova versão (pode demorar 1-2min)
- [ ] Toast/banner "Nova versão disponível" aparece
- [ ] Clicar em "Atualizar Agora"
- [ ] App recarrega com nova versão
- [ ] Verificar que mudança está presente

---

## 🌐 Teste 6: Funcionalidade Offline

### Preparação
- [ ] Visitar app online primeiro (para cachear recursos)
- [ ] Navegar por todas as páginas principais (/, /favorites)
- [ ] Gerar algumas frases

### Teste Offline Real
- [ ] **Ativar modo avião** (não usar apenas DevTools)
- [ ] Tentar abrir app da tela inicial
- [ ] App deve carregar (pode demorar alguns segundos)
- [ ] Verificar funcionalidades:
  - [ ] Página inicial carrega
  - [ ] Última frase aparece
  - [ ] Navegação funciona
  - [ ] Botões respondem

### Reconexão
- [ ] Desativar modo avião
- [ ] App deve detectar que voltou online
- [ ] Funcionalidades voltam a funcionar

---

## ⚡ Teste 7: Performance - Lighthouse

### Rodar Audit
- [ ] Abrir DevTools → Lighthouse tab
- [ ] Selecionar: Performance, PWA, Accessibility, Best Practices, SEO
- [ ] Mode: Navigation
- [ ] Device: Mobile
- [ ] Clicar "Analyze page load"

### Scores Esperados
- [ ] **PWA**: ≥ 90 (ideal 100)
- [ ] **Performance**: ≥ 80
- [ ] **Accessibility**: ≥ 90
- [ ] **Best Practices**: ≥ 90
- [ ] **SEO**: ≥ 90

### PWA Checklist (Lighthouse)
- [ ] ✅ Registers a service worker
- [ ] ✅ Redirects HTTP to HTTPS
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets a theme color
- [ ] ✅ Content sized correctly for viewport
- [ ] ✅ Has a `<meta name="viewport">` tag
- [ ] ✅ Provides a valid apple-touch-icon
- [ ] ✅ Maskable icon present

---

## 📐 Teste 8: Responsividade

### Tamanhos a Testar (Chrome DevTools → Toggle Device Toolbar)

#### Mobile Small (320px)
- [ ] iPhone SE (375x667)
- [ ] Layout não quebra
- [ ] Texto legível
- [ ] Botões acessíveis

#### Mobile Medium (375px-414px)
- [ ] iPhone 12 Pro (390x844)
- [ ] Pixel 5 (393x851)
- [ ] Logo + título do header visíveis
- [ ] Card de frase bem proporcionado

#### Tablet (768px-1024px)
- [ ] iPad (768x1024)
- [ ] Layout aproveita espaço extra

#### Desktop (1280px+)
- [ ] Desktop 1920x1080
- [ ] Conteúdo centralizado

---

## ♿ Teste 9: Acessibilidade

### Navegação por Teclado
- [ ] Tab navega entre elementos interativos
- [ ] Ordem de tabulação faz sentido
- [ ] Focus visível (borda azul/outline)
- [ ] Enter ativa botões
- [ ] Esc fecha modais

### Contraste
- [ ] Texto tem contraste ≥ 4.5:1
- [ ] Botões inativos claramente distintos
- [ ] Links claramente visíveis

---

## 🔒 Teste 10: Segurança

### HTTPS
- [ ] URL começa com `https://`
- [ ] Cadeado aparece na barra de endereço
- [ ] Certificado SSL válido
- [ ] Sem warnings de conteúdo misto

---

## 🎨 Teste 11: UX e Polimento

### Feedback Visual
- [ ] Botões têm hover state
- [ ] Botões têm active state (ao clicar)
- [ ] Transições suaves
- [ ] Loading states claros
- [ ] Toasts aparecem e desaparecem automaticamente

---

## 🌍 Teste 12: Multiplataforma

### Chrome Android
- [ ] App carrega
- [ ] Instalação funciona
- [ ] Offline funciona
- [ ] Compartilhamento funciona

### Safari iOS
- [ ] App carrega
- [ ] Instalação funciona (manual)
- [ ] Offline funciona
- [ ] Safe areas respeitadas

### Chrome Desktop
- [ ] App carrega
- [ ] Instalação funciona
- [ ] Offline funciona

---

## ✅ Critérios de Aceitação Final

Para considerar o PWA **production-ready**:

### Obrigatórios
- [ ] PWA instala em Android Chrome
- [ ] PWA instala em Safari iOS (via instruções)
- [ ] Funciona offline (ao menos tela inicial)
- [ ] Service Worker registra sem erros
- [ ] Manifest válido sem erros
- [ ] Lighthouse PWA score ≥ 90
- [ ] HTTPS configurado
- [ ] Sem console errors críticos
- [ ] Responsivo em mobile/tablet/desktop

### Desejáveis
- [ ] Lighthouse Performance ≥ 80
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Atualização automática funciona
- [ ] Headers de segurança configurados
