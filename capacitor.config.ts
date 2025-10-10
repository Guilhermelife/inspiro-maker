import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.6c2ef112f2c34330b6b3938307e15460',
  appName: 'Frases do Dia',
  webDir: 'dist',
  server: {
    url: 'https://6c2ef112-f2c3-4330-b6b3-938307e15460.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    AdMob: {
      appId: 'ca-app-pub-4360211752887255~5264098917',
      testDeviceIds: [],
    }
  }
};

export default config;
