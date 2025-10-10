import { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';

const BANNER_AD_UNIT_ID = 'ca-app-pub-4360211752887255/5525196631';
const TEST_BANNER_AD_UNIT_ID = 'ca-app-pub-3940256099942544/6300978111';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        setIsNative(true);
        try {
          await AdMob.initialize({
            testingDevices: [],
            initializeForTesting: true, // Mudar para false em produção
          });
          setIsInitialized(true);
          console.log('AdMob initialized successfully');
        } catch (error) {
          console.error('AdMob initialization failed:', error);
        }
      }
    };

    initAdMob();
  }, []);

  const showBanner = async () => {
    if (!isNative || !isInitialized) return;

    const options: BannerAdOptions = {
      adId: TEST_BANNER_AD_UNIT_ID, // Use BANNER_AD_UNIT_ID em produção
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true, // Mudar para false em produção
    };

    try {
      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Failed to show banner:', error);
    }
  };

  const hideBanner = async () => {
    if (!isNative) return;
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Failed to hide banner:', error);
    }
  };

  const removeBanner = async () => {
    if (!isNative) return;
    try {
      await AdMob.removeBanner();
    } catch (error) {
      console.error('Failed to remove banner:', error);
    }
  };

  return {
    isInitialized,
    isNative,
    showBanner,
    hideBanner,
    removeBanner,
  };
};
