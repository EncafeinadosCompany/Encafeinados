import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import jestPlugin from 'eslint-plugin-jest';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      'plugin:jest/recommended', // Configuración recomendada para Jest
      'plugin:testing-library/react', // Configuración recomendada para Testing Library
    ],
    files: ['**/*.{ts,tsx}', 'src/tests/**/*'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.jest, // Habilita las variables globales de Jest
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jest': jestPlugin, // Plugin para Jest
      'testing-library': testingLibraryPlugin, // Plugin para Testing Library
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Reglas específicas para Testing Library
      'testing-library/no-debugging-utils': 'warn',
      'testing-library/no-dom-import': 'off',
      // Reglas específicas para Jest
      'jest/no-conditional-expect': 'off',
    },
  },
);