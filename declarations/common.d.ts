type RecognID = Record<
  'setParams',
  (props: Record<'locale' | 'resources', string>) => void
> &
  Record<
    'init',
    Record<'request_id' | 'webhook_url' | 'language', string> &
      Record<'stages', string[]>
  >;

declare global {
  interface Window {
    FingerprintJS: any;
    requestIdleCallback: () => void;
    nj: any;
    RecognID: RecognID;
  }
}

declare interface Window {
  requestIdleCallback: () => void;
  FingerprintJS: any;
  nj: any;
  RecognID: RecognID;
}

declare interface Console {
  toJS: (data: any, description?: string) => void;
  dev: (...data: unknown[]) => void;
}

declare module '*.po' {
  const poModule: { [key: string]: string };

  export default poModule;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare function px2em(size: number, baseSize = 16): string;

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface CredentialRequestOptions {
  otp?: any;
}
interface Credential {
  code?: any;
}
