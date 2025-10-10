# 📱 Guia de Configuração AdMob com Capacitor

## ✅ Implementação Concluída

Os seguintes arquivos foram criados/modificados:
- `capacitor.config.ts` - Configuração do Capacitor com IDs do AdMob
- `src/hooks/useAdMob.ts` - Hook personalizado para gerenciar banners
- `src/components/AdBanner.tsx` - Componente atualizado para usar AdMob nativo

## 🚀 Próximos Passos (OBRIGATÓRIO)

### 1. Exportar Projeto para GitHub
Clique no botão "Export to GitHub" no topo direito do Lovable.

### 2. Clonar no Seu Computador Local
```bash
git clone <seu-repositorio>
cd <nome-do-projeto>
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Buildar o Projeto
```bash
npm run build
```

### 5. Adicionar Plataformas Nativas

**Para Android:**
```bash
npx cap add android
```

**Para iOS (apenas no Mac com Xcode):**
```bash
npx cap add ios
```

### 6. Configurar Android

Edite `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <application>
    <!-- Adicione dentro da tag <application> -->
    <meta-data
      android:name="com.google.android.gms.ads.APPLICATION_ID"
      android:value="ca-app-pub-4360211752887255~5264098917"/>
  </application>
  
  <!-- Adicione antes de </manifest> -->
  <uses-permission android:name="android.permission.INTERNET"/>
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
</manifest>
```

### 7. Configurar iOS

Edite `ios/App/App/Info.plist`:

```xml
<dict>
  <!-- Adicione dentro da tag <dict> -->
  <key>GADApplicationIdentifier</key>
  <string>ca-app-pub-4360211752887255~5264098917</string>
  
  <key>NSUserTrackingUsageDescription</key>
  <string>Este app usa anúncios personalizados para melhorar sua experiência.</string>
</dict>
```

### 8. Sincronizar Capacitor
```bash
npx cap sync
```

### 9. Testar no Emulador/Device

**Android:**
```bash
npx cap run android
```

**iOS (Mac apenas):**
```bash
npx cap run ios
```

Ou abrir no Android Studio/Xcode:
```bash
npx cap open android
npx cap open ios
```

## 🎯 IDs do AdMob

### App ID
```
ca-app-pub-4360211752887255~5264098917
```

### Banner Ad Unit ID (Produção)
```
ca-app-pub-4360211752887255/5525196631
```

### Test Banner Ad Unit ID (Desenvolvimento)
```
ca-app-pub-3940256099942544/6300978111
```

## 🔧 Modo Teste vs Produção

### Durante Desenvolvimento
O código atual está configurado para TESTE:
- `initializeForTesting: true`
- `isTesting: true`
- Usando `TEST_BANNER_AD_UNIT_ID`

### Para Publicar na Loja
Edite `src/hooks/useAdMob.ts`:

```typescript
// Linha 19: Mudar para false
initializeForTesting: false,

// Linha 36: Usar ID de produção
adId: BANNER_AD_UNIT_ID,

// Linha 40: Mudar para false
isTesting: false,
```

## 📝 Políticas AdMob

Leia as políticas antes de publicar:
- [Políticas do AdMob](https://support.google.com/admob/answer/6128543)
- [Políticas de Conteúdo](https://support.google.com/admob/answer/6128877)

## 🔍 Troubleshooting

### Banner não aparece?
1. Verifique se está rodando em dispositivo/emulador (não funciona no navegador web)
2. Confira os logs no console: `npx cap run android -l` ou `npx cap run ios -l`
3. Certifique-se de que o App ID está correto no `AndroidManifest.xml` / `Info.plist`

### Erro "AdMob not initialized"?
- O AdMob só inicializa em plataformas nativas (Android/iOS)
- No navegador web, o componente exibe um placeholder

## 📚 Recursos

- [Documentação Capacitor](https://capacitorjs.com/)
- [Plugin AdMob Community](https://github.com/capacitor-community/admob)
- [Guia de Banners AdMob](https://developers.google.com/admob/android/banner)
