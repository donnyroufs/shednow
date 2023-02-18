declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      REDIRECT_URI: string;
      ORIGIN_URL: string;
      SESSION_SECRET: string;
      REDIS_URL: string;
    }
  }
}

export {};
