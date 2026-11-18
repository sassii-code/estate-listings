/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_BUSINESS_ADDRESS?: string;
  readonly VITE_BUSINESS_EMAIL?: string;
  readonly VITE_BUSINESS_PHONE?: string;
  readonly VITE_BUSINESS_OWNER_NAME?: string;
  readonly VITE_YEARS_IN_HARIDWAR?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
