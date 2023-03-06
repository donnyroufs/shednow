declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface ProcessEnv {
      NODE_ENV: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_SECRET: string;
      GOOGLE_CALLBACK_URL: string;
      REDIRECT_URI: string;
      ORIGIN_URL: string;
      SESSION_SECRET: string;
      REDIS_URL: string;
      DATABASE_URL: string;
      PRIVATE_KEY: string;
      CLIENT_EMAIL: string;
      DOMAIN: string;
      SERVICE_ACCOUNT: string;
    }
  }
}

export {};
