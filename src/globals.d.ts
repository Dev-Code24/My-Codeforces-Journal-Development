export {};

declare global {
  interface Window {
    APP_SCRIPT_URL: string;
    APPSCRIPT_VERIFIED: boolean;
    CODEFORCES_URL: string;
    CODEFORCES_VERIFIED: boolean;
    SETUP_COMPLETE: boolean;
  }
}
