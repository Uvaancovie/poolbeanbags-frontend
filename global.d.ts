// Minimal global types to satisfy JSX/React for this toy project
/// <reference types="node" />

declare namespace React {
  type ReactNode = import('react').ReactNode;
  type JSXElementConstructor<P = any> = import('react').JSXElementConstructor<P>;
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      key?: string | number;
    }
    interface IntrinsicElements {
      // allow any HTML tag with any props to avoid JSX errors in this example
      [elemName: string]: any;
    }
  }
}

export {};
