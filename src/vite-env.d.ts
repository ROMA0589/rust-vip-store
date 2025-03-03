/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}
