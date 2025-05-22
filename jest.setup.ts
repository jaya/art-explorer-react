// jest.setup.ts
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null;
  rootMargin: string;
  thresholds: ReadonlyArray<number>;

  constructor() {
    this.root = null;
    this.rootMargin = "";
    this.thresholds = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(_target: Element) {
    // do nothing
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(_target: Element) {
    // do nothing
  }

  disconnect() {
    // do nothing
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  observe(_target: Element) {
    // do nothing
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(_target: Element) {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Aqui você pode adicionar outros setups globais, como mocks para APIs globais (fetch, localStorage, etc.)

// Silenciar console.warn durante testes para evitar poluição nos logs
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    // Você pode filtrar avisos que deseja ignorar completamente
    if (args[0]?.includes("Erro ao carregar imagem para:")) {
      return;
    }
    // Para outros avisos, você pode manter o comportamento original (opcional)
    originalWarn(...args);
  };
});

// Restaurar console.warn original depois dos testes
afterAll(() => {
  console.warn = originalWarn;
});

// Se você usa APIs como window.scrollTo, pode mocká-las também se necessário:
// Object.defineProperty(global.window, 'scrollTo', { value: jest.fn(), writable: true });

// Limpar mocks após cada teste para garantir isolamento
afterEach(() => {
  jest.clearAllMocks();
});
