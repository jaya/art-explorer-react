// jest.config.ts
import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy", 
    "^@/(.*)$": "<rootDir>/src/$1", 
  },

  collectCoverage: true,
  coverageProvider: "v8", 
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts", 
    "!src/main.tsx", 
    "!src/vite-env.d.ts",
    "!src/constants/**",
    "!src/lib/**",
    "!src/types/**", 
    "!src/components/ui/**",
    "!src/index.ts",
    "!src/App.tsx",
    "!src/services/artworks/index.ts",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "clover"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  transformIgnorePatterns: [
    "/node_modules/",
  ],

  displayName: {
    name: "ArtExplorerTests",
    color: "blue",
  },

  clearMocks: true,

  resetMocks: true,

  restoreMocks: true,
  
  verbose: true,
};

export default config;
