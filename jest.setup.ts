// jest.setup.ts
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(_target: Element) {
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
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unobserve(_target: Element) {
  }
  disconnect() {
  }
};

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});


const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (args[0]?.includes("Erro ao carregar imagem para:")) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});

afterEach(() => {
  jest.clearAllMocks();
});
