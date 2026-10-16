/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  /** MiniOxygen / Oxygen environment variables. Only the session secret is used in this phase. */
  interface Env {
    SESSION_SECRET?: string;
  }
}

export {};
