// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  // Indica o ambiente de teste que será usado
  testEnvironment: "jest-environment-jsdom",

  // Uma lista de caminhos para módulos que rodam algum código para configurar ou
  // preparar o ambiente de teste antes de cada teste.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Um mapa de expressões regulares para nomes de módulos que permitem
  // stubbar assets como imagens ou folhas de estilo com um único módulo.
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Para arquivos CSS Modules ou CSS global
    "^@/(.*)$": "<rootDir>/src/$1", // Para lidar com alias de caminho como @/components
  },

  // Indica se a cobertura de código deve ser coletada durante a execução dos testes
  collectCoverage: true,
  coverageProvider: "v8", // ou 'babel'
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts", // Não coletar de arquivos de definição de tipo
    "!src/main.tsx", // Não testar o ponto de entrada principal
    "!src/vite-env.d.ts",
    "!src/constants/**", // Ignora toda a pasta de constantes
    "!src/lib/**", // Ignora toda a pasta de utilitários/biblioteca
    "!src/types/**", // Ignora toda a pasta de tipos
    "!src/components/ui/**", // Ignora toda a pasta de UI genérica
    "!src/index.ts", // Ignora o arquivo de index principal
    "!src/App.tsx", // Ignora o componente App principal
    "!src/services/artworks/index.ts", // Ignora o index dos serviços de artworks
    // Adicione outros arquivos/pastas que desejar ignorar
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],

  // Transformador para arquivos TypeScript
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  // Padrões de arquivos de teste
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  // Extensões de arquivo que seus módulos usam
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Ignorar transformações para node_modules, exceto para módulos específicos (se necessário)
  transformIgnorePatterns: [
    "/node_modules/",
    // Adicione exceções aqui se algum módulo do node_modules precisar ser transformado
    // Ex: '/node_modules/(?!some-es-module-package)/'
  ],

  // Mostra nomes de exibição para testes quando disponíveis
  displayName: {
    name: "ArtExplorerTests",
    color: "blue",
  },

  // Limpa mocks entre cada teste
  clearMocks: true,

  // Reseta mocks entre cada teste
  resetMocks: true,

  // Restaura o estado do mock entre cada teste
  restoreMocks: true,

  // Verbose output
  verbose: true,
};

export default config;
