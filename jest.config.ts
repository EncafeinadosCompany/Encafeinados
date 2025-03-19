import { defaults } from 'jest-config';
import path from 'path';
export default {

  rootDir: path.resolve(__dirname),
  // Extiende las configuraciones predeterminadas de Jest
  ...defaults,

  // Especifica el entorno de pruebas (jsdom para pruebas de frontend)
  testEnvironment: 'jest-environment-jsdom',

  // Archivos que se ejecutan antes de cada suite de pruebas
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],

  // Mapeo de alias para importaciones (si usas alias como @/)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Transforma archivos TypeScript y JavaScript usando Babel
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },

  // Patrones para buscar archivos de prueba
  testMatch: [
    '<rootDir>/src/tests/unit/**/*.test.(js|jsx|ts|tsx)', // Pruebas unitarias
  ],

  // Ignorar estas carpetas al buscar pruebas
  testPathIgnorePatterns: ['<rootDir>/node_modules/'], // Ignora node_modules y pruebas E2E

  // Extensiones de archivo que Jest reconocerá
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],

  // Habilitar salida detallada
  verbose: true,

  // Configuración adicional para TypeScript
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json', // Usa tu archivo tsconfig
    },
  },
};