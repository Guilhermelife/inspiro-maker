import { useEffect, useState } from 'react';
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { Capacitor } from '@capacitor/core';
import { ADMOB_CONFIG } from '@/config/admob';

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
            initializeForTesting: ADMOB_CONFIG.IS_TESTING,
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
      adId: ADMOB_CONFIG.BANNER_AD_UNIT_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: ADMOB_CONFIG.IS_TESTING,
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
