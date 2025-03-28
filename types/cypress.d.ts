declare module '@cypress/browserify-preprocessor' {
    import { Plugin } from 'vite'; // Ajusta el tipo según sea necesario
    const browserify: (options?: any) => Plugin;
    export default browserify;
  }