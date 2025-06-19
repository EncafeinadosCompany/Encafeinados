declare module '@cypress/browserify-preprocessor' {
    import { Plugin } from 'vite'; 
    const browserify: (options?: any) => Plugin;
    export default browserify;
  }