export const ADMOB_CONFIG = {
  BANNER_AD_UNIT_ID: import.meta.env.PROD 
    ? 'ca-app-pub-4360211752887255/5525196631' 
    : 'ca-app-pub-3940256099942544/6300978111',
  
  APP_ID: 'ca-app-pub-4360211752887255~5264098917',
  
  IS_TESTING: import.meta.env.DEV,
};
