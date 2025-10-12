# 📱 Guia de Build para App Nativo

## ✅ Melhorias Implementadas

### **Capacitor Config**
- ✅ Removido URL de desenvolvimento (agora usa arquivos locais)
- ✅ Configurado SplashScreen
- ✅ Configurado StatusBar
- ✅ Adicionado suporte a Deep Links

### **Manifest PWA**
- ✅ Adicionado `related_applications` (Google Play)
- ✅ Adicionado `share_target` (receber compartilhamentos)
- ✅ Adicionado `protocol_handlers` (deep links)
- ✅ Screenshots para lojas de apps

### **HTML & Meta Tags**
- ✅ Corrigido `lang="pt-BR"`
- ✅ Adicionado meta tags Microsoft
- ✅ Open Graph com imagens reais do app
- ✅ Criado `browserconfig.xml`

### **Código Nativo**
- ✅ StatusBar configurado (cor azul)
- ✅ Share API nativo (Capacitor)
- ✅ Haptic feedback ao favoritar
- ✅ Deep links handler
- ✅ AdMob com switch automático dev/prod

### **Plugins Instalados**
- ✅ `@capacitor/status-bar`
- ✅ `@capacitor/splash-screen`
- ✅ `@capacitor/share`
- ✅ `@capacitor/haptics`
- ✅ `@capacitor/app`

---

## 🚀 Como Compilar o App Nativo

### **Passo 1: Exportar para GitHub**
1. Na interface do Lovable, clique em **"Export to Github"**
2. Conecte sua conta GitHub
3. Escolha um repositório

### **Passo 2: Clonar Projeto Localmente**
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPO.git
cd SEU_REPO
```

### **Passo 3: Instalar Dependências**
```bash
npm install
```

### **Passo 4: Adicionar Plataformas Nativas**

**Para Android:**
```bash
npx cap add android
```

**Para iOS (apenas no macOS):**
```bash
npx cap add ios
```

### **Passo 5: Build do Projeto**
```bash
npm run build
```

### **Passo 6: Sincronizar com Capacitor**
```bash
npx cap sync
```

### **Passo 7: Abrir no IDE Nativo**

**Android Studio:**
```bash
npx cap open android
```

**Xcode (iOS):**
```bash
npx cap open ios
```

### **Passo 8: Configurar Assets Nativos**

#### **Android - Ícone Adaptativo**
1. No Android Studio, vá em `File > New > Image Asset`
2. Selecione o logo do app (`public/logo.png`)
3. Gere os ícones adaptativos

#### **Android - Splash Screen**
1. Coloque uma imagem 2732x2732 em `android/app/src/main/res/drawable/splash.png`
2. A área segura deve ser 1200x1200 no centro

#### **iOS - Ícones e Splash**
1. No Xcode, abra `Assets.xcassets`
2. Adicione os ícones e splash screens

---

## 🏪 Publicar nas Lojas

### **Google Play Console**
1. Crie uma conta de desenvolvedor ($25 única vez)
2. No Android Studio: `Build > Generate Signed Bundle / APK`
3. Escolha **Android App Bundle (AAB)**
4. Configure chave de assinatura
5. Upload no Google Play Console

### **App Store (iOS)**
1. Crie uma conta Apple Developer ($99/ano)
2. No Xcode: `Product > Archive`
3. Configure provisioning profiles
4. Upload via App Store Connect

---

## 🧪 Testar em Dispositivo Físico

### **Android**
```bash
# Conecte o dispositivo via USB com depuração USB ativada
npx cap run android
```

### **iOS**
```bash
# Conecte iPhone/iPad via USB
npx cap run ios
```

---

## 🔄 Workflow de Desenvolvimento

Após fazer mudanças no código do Lovable:

1. **Git pull** do repositório
2. **`npm install`** (se houver novas dependências)
3. **`npm run build`**
4. **`npx cap sync`**
5. Testar no emulador/dispositivo

---

## 📋 Checklist de Validação

### **Android**
- [ ] App abre sem erros
- [ ] StatusBar azul (#3B82F6)
- [ ] SplashScreen aparece
- [ ] Ícone adaptativo correto
- [ ] Banner AdMob aparece (teste com ID de teste)
- [ ] Botão Share funciona nativamente
- [ ] Vibração ao favoritar funciona
- [ ] App funciona 100% offline
- [ ] Deep links funcionam

### **iOS**
- [ ] App abre sem erros
- [ ] StatusBar configurado
- [ ] SplashScreen aparece
- [ ] Ícone no home screen correto
- [ ] Banner AdMob aparece
- [ ] Share funciona nativamente
- [ ] Haptics funcionam
- [ ] App funciona 100% offline

### **Web/PWA**
- [ ] Lighthouse score > 90
- [ ] Installable prompt aparece
- [ ] Service Worker registrado
- [ ] Manifest válido

---

## 🐛 Solução de Problemas

### **Erro: "Cannot read property of undefined"**
Execute `npx cap sync` novamente

### **AdMob não aparece**
- Verifique se o plugin está instalado: `npm ls @capacitor-community/admob`
- Em ambiente de desenvolvimento, usa ID de teste automaticamente
- Em produção, usa ID real

### **StatusBar não muda de cor**
- Certifique-se que o plugin está instalado: `npm ls @capacitor/status-bar`
- Execute `npx cap sync`

### **Share não funciona**
- Verifique se `@capacitor/share` está instalado
- Em iOS, precisa configurar permissões no Info.plist

---

## 💰 AdMob - Modo Produção

O app já está configurado para usar automaticamente:
- **Desenvolvimento (`npm run dev`)**: IDs de teste do AdMob
- **Produção (`npm run build`)**: IDs reais de anúncios

Não precisa mudar nada no código!

---

## 🔗 Links Úteis

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Studio Download](https://developer.android.com/studio)
- [Xcode Download](https://apps.apple.com/us/app/xcode/id497799835)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)
- [AdMob Console](https://apps.admob.com)

---

## 📞 Suporte

Para dúvidas sobre o Capacitor, consulte:
- [Blog Lovable sobre Mobile](https://lovable.dev/blogs/)
- [Discord da Lovable](https://discord.gg/lovable)
