
/// <reference types="vite/client" />

// Type definitions for Facebook SDK
interface FacebookSDK {
  init(options: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version?: string;
  }): void;
  login(callback: (response: any) => void, options?: object): void;
  getLoginStatus(callback: (response: any) => void): void;
  api(path: string, callback: (response: any) => void): void;
  AppEvents: {
    logPageView(): void;
  };
  // Add other Facebook SDK methods as needed
}

// Extend the Window interface to include the FB property
interface Window {
  FB: FacebookSDK;
  fbAsyncInit: () => void;
}

