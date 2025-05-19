declare module 'expo-constants' {
    interface Extra {
      API_URL: string;
      // Add more variables here
    }
  
    interface AppConfig {
      extra: Extra;
    }
  
    const Constants: {
      expoConfig: AppConfig;
    };
  
    export default Constants;
  }
  