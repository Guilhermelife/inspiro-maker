# 📱 PWA - Frases do Dia

## ✅ Implementação Completa

Seu aplicativo agora é um **Progressive Web App (PWA)** completo e pronto para produção!

## 🎯 Próximos Passos

### 1. Gerar Ícones PWA

Antes de fazer o deploy, você precisa gerar todos os ícones e splash screens:

```bash
# Execute o script de geração de ícones
node scripts/generate-pwa-icons.js
```

Este script criará automaticamente:
- ✅ 8 ícones padrão (48px a 512px)
- ✅ 1 ícone maskable para Android (512px com safe zone)
- ✅ 3 Apple Touch Icons (120px, 152px, 180px)
- ✅ 6 Splash Screens para iOS (diferentes resoluções)

**Total:** 18 arquivos de imagem em `public/icons/` e `public/splash/`

### 2. Testar Localmente

```bash
# Development com PWA ativo
npm run dev

# Ou build de produção para testar offline
npm run build
npm run preview
```

### 3. Verificar no Chrome DevTools

1. Abra o app (localhost:8080)
2. Pressione F12 (DevTools)
3. Vá para **Application** tab
4. Verifique:
   - **Manifest**: deve carregar sem erros
   - **Service Workers**: deve estar "activated and running"
   - **Cache Storage**: deve ter caches criados após navegação

### 4. Testar Instalação

#### Desktop (Chrome/Edge)
- Procure o ícone de instalação na barra de endereço (+)
- Ou veja o banner de instalação personalizado na página

#### Mobile (Android Chrome)
- Acesse via HTTPS (faça deploy primeiro)
- Banner de instalação aparecerá automaticamente
- Ou vá em Menu → "Instalar app"

#### Mobile (iOS Safari)
- Banner customizado com instruções detalhadas
- Siga os 3 passos mostrados no modal
- Instalação manual: Compartilhar → "Adicionar à Tela de Início"

### 5. Deploy em Produção

**IMPORTANTE:** PWAs requerem HTTPS!

#### Opção 1: Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Opção 2: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 6. Validar com Lighthouse

Após deploy, rode o Lighthouse para verificar scores:

1. DevTools → Lighthouse tab
2. Selecione todos os checkboxes
3. Device: Mobile
4. Clique "Analyze page load"

**Metas:**
- PWA Score: ≥ 90
- Performance: ≥ 80
- Accessibility: ≥ 90

## 📚 Documentação

- **[PWA-SETUP.md](./PWA-SETUP.md)** - Guia completo de setup e deploy
- **[TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md)** - Checklist detalhado de testes

## 🎨 Funcionalidades Implementadas

### ✅ Instalável
- Banner de instalação customizado para Android
- Instruções passo-a-passo para iOS
- Detecta se já está instalado

### ✅ Offline
- Service Worker com Workbox
- Cache inteligente (precache + runtime)
- Página offline personalizada
- Estratégias específicas para APIs, fontes e imagens

### ✅ Atualizações
- Notificação quando há nova versão disponível
- Botão para atualizar imediatamente
- Feedback quando app está pronto para uso offline

### ✅ Responsivo
- Safe areas para iOS (notch/home indicator)
- Layout adaptado para 320px até 2560px
- Touch-friendly (botões com área mínima de toque)

### ✅ Performance
- Assets otimizados
- Lazy loading de componentes
- Cache estratégico
- Fontes do Google Fonts cacheadas

### ✅ Compatibilidade
- Chrome (Desktop/Android)
- Safari (Desktop/iOS)
- Edge (Desktop/Android)
- Firefox (parcial - sem instalação)

## 🔧 Arquivos Criados

```
public/
├── manifest.json                 # ← Manifest PWA
├── offline.html                  # ← Página offline
├── icons/                        # ← (gerar com script)
│   ├── icon-48x48.png
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-144x144.png
│   ├── icon-192x192.png
│   ├── icon-256x256.png
│   ├── icon-384x384.png
│   ├── icon-512x512.png
│   ├── icon-maskable-512x512.png
│   ├── apple-touch-icon-120x120.png
│   ├── apple-touch-icon-152x152.png
│   └── apple-touch-icon-180x180.png
└── splash/                       # ← (gerar com script)
    ├── apple-splash-2048-2732.png
    ├── apple-splash-1668-2388.png
    ├── apple-splash-1536-2048.png
    ├── apple-splash-1170-2532.png
    ├── apple-splash-1125-2436.png
    └── apple-splash-828-1792.png

src/
├── hooks/
│   └── usePWAInstall.ts          # ← Hook de instalação
├── components/
│   ├── InstallPrompt.tsx         # ← Banner de instalação
│   └── UpdatePrompt.tsx          # ← Notificação de atualização

scripts/
└── generate-pwa-icons.js         # ← Script de geração

docs/
├── README-PWA.md                 # ← Este arquivo
├── PWA-SETUP.md                  # ← Guia de setup
└── TESTING-CHECKLIST.md          # ← Checklist de testes
```

## 🚀 Características do PWA

### Manifest
- Nome: "Frases do Dia - Motivacionais & Reflexivas"
- Nome curto: "Frases do Dia"
- Cor do tema: #3B82F6 (azul primário)
- Display: standalone (tela cheia)
- Orientação: portrait
- Ícones: 9 tamanhos + maskable
- Shortcuts: "Nova Frase" e "Favoritos"

### Service Worker
- Workbox (Google)
- Precaching de assets estáticos
- Runtime caching:
  - Google Fonts: CacheFirst (1 ano)
  - Supabase API: NetworkFirst (5 min)
  - Imagens: CacheFirst (30 dias)

### Instalação
- `beforeinstallprompt` capturado
- Banner customizado (Android)
- Modal com instruções (iOS)
- Detecta se já está instalado
- Fecha automaticamente após instalação

### Atualização
- Detecta nova versão
- Toast com opção de atualizar
- Recarrega automaticamente após confirmar
- Notifica quando offline está pronto

## 🎯 Próximas Melhorias (Roadmap)

### Fase 2 (Futuro)
- [ ] Push Notifications
- [ ] Background Sync
- [ ] Periodic Background Sync
- [ ] Web Share Target
- [ ] Offline Analytics Queue

### Play Store (Opcional)
- [ ] Criar TWA com Bubblewrap
- [ ] Screenshots para diversos dispositivos
- [ ] Criar Privacy Policy
- [ ] Publicar na Google Play Store

## 🆘 Problemas Comuns

### "Manifest not found"
→ Execute `npm run build` e `npm run preview` (não use `npm run dev` para testar manifest em produção)

### "Service Worker registration failed"
→ Certifique-se de estar em HTTPS ou localhost

### Ícones não aparecem
→ Execute `node scripts/generate-pwa-icons.js` primeiro

### App não instala no iOS
→ Normal! iOS requer instalação manual via Safari (instruções aparecerão no modal)

## 📞 Suporte

- **Documentação Vite PWA**: https://vite-pwa-org.netlify.app/
- **Web.dev PWA Guide**: https://web.dev/progressive-web-apps/
- **Can I Use (Service Workers)**: https://caniuse.com/serviceworkers

---

**Parabéns! 🎉** Seu app agora é um PWA completo e pronto para uso em produção!
