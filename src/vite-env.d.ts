/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HITPAY_API_KEY: string
  readonly VITE_HITPAY_SALT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  HitPay?: {
    inited: boolean;
    init: (url: string, config: any, callbacks: any) => void;
    toggle: (options: any) => void;
  }
}