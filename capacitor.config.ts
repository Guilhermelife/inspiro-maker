import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.frasesdodia.motivacional',
  appName: 'Frases do Dia',
  webDir: 'dist',
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-4360211752887255~5264098917',
      testDeviceIds: [],
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#FFFFFF",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: false,
      splashImmersive: false
    },
    StatusBar: {
      style: 'Light',
      backgroundColor: '#3B82F6',
    },
    App: {
      launchUrl: 'br.com.frasesdodia.motivacional://'
    }
  }
};

export default config;
