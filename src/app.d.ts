// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      domain: 'olix0r.net' | 'ver.ooo';
    }
    // Cloudflare Pages
    // interface Platform {
    //   env: {
    //     COUNTER: DurableObjectNamespace;
    //   };
    //   context: {
    //     waitUntil(promise: Promise<any>): void;
    //   };
    //   caches: CacheStorage & { default: Cache };
    // }
    // interface PageData {}
    // interface PageState {}
  }
}

export {};
