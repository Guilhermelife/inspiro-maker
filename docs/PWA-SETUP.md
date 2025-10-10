# 🚀 PWA Setup - Frases do Dia

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- HTTPS (obrigatório para PWA em produção)

## Instalação e Build

```bash
# 1. Instalar dependências
npm install

# 2. Gerar ícones PWA
npm run generate-pwa-icons

# 3. Build de produção
npm run build

# 4. Preview local do build
npm run preview
```

## Estrutura de Arquivos PWA

```
public/
├── manifest.json              # Manifest PWA
├── offline.html               # Página offline fallback
├── icons/                     # Ícones em múltiplos tamanhos
│   ├── icon-48x48.png
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   ├── icon-maskable-512x512.png
│   └── apple-touch-icon-*.png
└── splash/                    # Splash screens iOS
    └── apple-splash-*.png

src/
├── hooks/
│   └── usePWAInstall.ts       # Hook para instalação PWA
└── components/
    ├── InstallPrompt.tsx      # Banner de instalação
    └── UpdatePrompt.tsx       # Notificação de atualização
```

## Testando Localmente

### Chrome/Edge (Desktop)

1. `npm run dev` ou `npm run preview`
2. Abrir DevTools (F12)
3. Ir para "Application" → "Manifest"
4. Verificar se manifest está carregado corretamente
5. Ir para "Service Workers" e verificar registro
6. Clicar em "Offline" e testar funcionalidade offline

### Chrome Android

1. Fazer deploy em HTTPS (ex: Vercel, Netlify)
2. Acessar URL no Chrome Android
3. Menu (três pontos) → "Instalar app" ou banner automático
4. Verificar ícone na tela inicial
5. Abrir app instalado (deve abrir em tela cheia)
6. Ativar modo avião e verificar funcionamento offline

### Safari iOS

1. Fazer deploy em HTTPS
2. Acessar URL no Safari iOS
3. Tocar em "Compartilhar" (ícone de quadrado com seta)
4. Rolar para baixo e tocar em "Adicionar à Tela de Início"
5. Verificar ícone e splash screen
6. Abrir app e verificar funcionamento

## Deploy em Produção

### Requisitos Obrigatórios

1. **HTTPS** - PWAs só funcionam em HTTPS (exceto localhost)
2. **Valid SSL Certificate** - Certificado SSL válido
3. **Service Worker registrado** - Verificar no console

### Plataformas Recomendadas

#### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Configurar Domínio Customizado

No dashboard do Vercel:
1. Ir para Settings → Domains
2. Adicionar domínio (ex: `frasesdodia.com.br`)
3. Configurar DNS conforme instruções
4. Aguardar propagação (até 48h)

## Lighthouse Audit

```bash
# Instalar Lighthouse CLI
npm install -g lighthouse

# Rodar audit
lighthouse https://seu-dominio.com --view
```

Ou usar o Lighthouse no Chrome DevTools (F12 → Lighthouse tab)

**Scores Esperados:**
- PWA: ≥ 90 (ideal 100)
- Performance: ≥ 80
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

## Publicação na Play Store (opcional)

### Usando Bubblewrap (Google PWABuilder)

1. Instalar Bubblewrap CLI
```bash
npm install -g @bubblewrap/cli
```

2. Inicializar projeto TWA
```bash
bubblewrap init --manifest=https://seu-dominio.com/manifest.json
```

3. Build APK
```bash
bubblewrap build
```

4. Upload para Play Console

### Requisitos Play Store

- [ ] App funciona 100% offline (ou mostra mensagem clara)
- [ ] Ícones de alta qualidade (512x512 maskable)
- [ ] Screenshots para diversos dispositivos
- [ ] Privacy Policy URL
- [ ] Descrição detalhada

## Troubleshooting

### Service Worker não registra

- Verificar HTTPS (não funciona em HTTP exceto localhost)
- Limpar cache do navegador
- Verificar console para erros
- Recarregar página com Ctrl+Shift+R

### Ícones não aparecem

- Verificar paths no manifest.json
- Conferir se arquivos existem em `public/icons/`
- Limpar cache e recarregar
- Verificar formato (PNG recomendado)

### App não instala no iOS

- iOS não suporta beforeinstallprompt
- Usuário precisa instalar manualmente via Safari
- Verificar se apple-touch-icon está configurado
- Confirmar que apple-mobile-web-app-capable está presente

### Offline não funciona

- Verificar se Service Worker está ativo (DevTools)
- Conferir estratégias de cache no vite.config.ts
- Verificar se offline.html existe
- Testar com modo avião real (não apenas DevTools)

## Monitoramento

### Analytics de PWA

Adicionar tracking de eventos customizados:

- `pwa_install_prompt_shown`
- `pwa_installed`
- `pwa_opened_from_homescreen`
- `pwa_used_offline`

### Métricas Importantes

- Taxa de instalação (installs / visitas)
- Taxa de retenção (DAU / MAU)
- Uso offline vs online
- Performance metrics (FCP, LCP, TTI)

## Roadmap Futuro

### Funcionalidades Avançadas

- [ ] Push Notifications (requer backend)
- [ ] Background Sync (sincronização offline → online)
- [ ] Periodic Background Sync (atualização automática)
- [ ] Web Share Target (receber compartilhamentos)
- [ ] Payment Request API
- [ ] Geolocation

## Suporte

Para dúvidas ou problemas:
1. Verificar console do navegador para erros
2. Consultar documentação do Vite PWA: https://vite-pwa-org.netlify.app/
3. Verificar compatibilidade: https://caniuse.com/serviceworkers
