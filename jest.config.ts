import { defaults } from "jest-config";
import path from "path";
export default {
  rootDir: path.resolve(__dirname),
  ...defaults,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // Transforma archivos TypeScript y JavaScript usando Babel
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  // Patrones para buscar archivos de prueba
  testMatch: [
    "<rootDir>/src/tests/unit/**/*.test.(js|jsx|ts|tsx)", // Pruebas unitarias
  ],

  // Ignorar estas carpetas al buscar pruebas
  testPathIgnorePatterns: ["<rootDir>/node_modules/"], // Ignora node_modules y pruebas E2E

  // Extensiones de archivo que Jest reconocerá
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],

  // Habilitar salida detallada
  verbose: true,

  // Configuración adicional para TypeScript
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/tsconfig.json", // Usa tu archivo tsconfig
    },
  },
};
