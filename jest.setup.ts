// jest.setup.ts
import "@testing-library/jest-dom";

// Aqui você pode adicionar outros setups globais, como mocks para APIs globais (fetch, localStorage, etc.)

// Exemplo de mock para matchMedia (comum em testes de componentes responsivos)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock para IntersectionObserver (usado por alguns componentes de UI ou bibliotecas de lazy loading)
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Se você usa APIs como window.scrollTo, pode mocká-las também se necessário:
// Object.defineProperty(global.window, 'scrollTo', { value: jest.fn(), writable: true });

// Limpar mocks após cada teste para garantir isolamento
afterEach(() => {
  jest.clearAllMocks();
});
