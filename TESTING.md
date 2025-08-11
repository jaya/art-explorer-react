# Guia de Testes para Art Explorer React

Este projeto utiliza uma estratégia abrangente de testes com **Jest + React Testing Library** para testes unitários/integração e **Playwright** para testes end-to-end.

## Índice

- [Início Rápido](#início-rápido)
- [Estratégia de Testes](#estratégia-de-testes)
- [Testes Unitários & Integração](#testes-unitários--integração)
- [Testes End-to-End](#testes-end-to-end)
- [Melhores Práticas](#melhores-práticas)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Escrevendo Testes](#escrevendo-testes)
- [Executando Testes](#executando-testes)
- [Depurando Testes](#depurando-testes)

## Início Rápido

```bash
# Instalar dependências
pnpm install

# Executar testes unitários
pnpm test

# Executar testes unitários em modo watch
pnpm test:watch

# Executar testes unitários com cobertura
pnpm test:coverage

# Executar testes e2e
pnpm test:e2e

# Executar todos os testes
pnpm test:all
```

## Estratégia de Testes

### Pirâmide de Testes

1. **Testes Unitários (70%)** - Jest + React Testing Library
   - Componentes individuais
   - Hooks customizados
   - Funções utilitárias
   - Lógica de negócio

2. **Testes de Integração (20%)** - Jest + React Testing Library
   - Interações entre componentes
   - Integração com API
   - Gerenciamento de estado

3. **Testes End-to-End (10%)** - Playwright
   - Fluxos críticos do usuário
   - Testes cross-browser
   - Testes de performance

### O Que Testar

✅ **DEVE Testar:**

- Renderização de componentes
- Interações do usuário (cliques, inputs de formulário)
- Mudanças de props e estado
- Comportamento de hooks customizados
- Integração com API
- Tratamento de erros
- Acessibilidade
- Jornadas críticas do usuário

❌ **NÃO Deve Testar:**

- Detalhes de implementação
- Bibliotecas de terceiros
- Estilos (a menos que afetem funcionalidade)
- Features específicas do browser (a menos que críticas)

## Testes Unitários & Integração

### Stack Tecnológica

- **Jest** - Test runner e biblioteca de asserção
- **React Testing Library** - Utilitários para testes de componentes React
- **@testing-library/user-event** - Simulação de interações do usuário
- **@testing-library/jest-dom** - Matchers adicionais para Jest

### Configuração

- **jest.config.js** - Configuração principal do Jest
- **jest.setup.js** - Setup global e mocks para testes
- **Limite de cobertura**: 70% para branches, funções, linhas e statements

### Escrevendo Testes Unitários

#### Testando Componentes

```typescript
// __tests__/components/ui/button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Componente Button', () => {
  it('renderiza com texto correto', () => {
    render(<Button>Clique em mim</Button>)
    expect(screen.getByRole('button', { name: /clique em mim/i })).toBeInTheDocument()
  })

  it('lida com eventos de clique', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Clique em mim</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Testando Hooks Customizados

```typescript
// __tests__/hooks/useDebounce.test.ts
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("Hook useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("aplica debounce em mudanças de valor", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "inicial", delay: 300 } },
    );

    rerender({ value: "atualizado", delay: 300 });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("atualizado");
  });
});
```

#### Testando Componentes com Context

```typescript
// __tests__/components/artwork-card.test.tsx
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ArtworkCard } from '@/components/Artwork/Card/ArtworkCard'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('ArtworkCard', () => {
  it('renderiza informações da obra', () => {
    render(<ArtworkCard objectID={123} index={0} />, {
      wrapper: createWrapper()
    })
    // ... assertions
  })
})
```

## Testes End-to-End

### Stack Tecnológica

- **Playwright** - Framework de testes cross-browser
- **Test runner integrado** - Execução paralela e relatórios

### Configuração

- **playwright.config.ts** - Configuração principal do Playwright
- **Padrão**: Apenas Chromium para execução mais rápida
- **Teste completo**: Todos os browsers disponíveis com `FULL_BROWSER_TEST=true`
- **Auto-start dev server** durante os testes

### Abordagem Simplificada

Os testes E2E foram simplificados para focar na funcionalidade core minimizando chamadas de API:

- **Funcionalidade Core**: Carregamento de página, navegação, interações básicas de UI
- **Busca Básica**: Input de busca, filtro por departamento, tratamento de erros
- **Favoritos Básicos**: Navegação, persistência no localStorage, estados vazios

Esta abordagem reduz o tempo de execução dos testes de ~10 minutos para ~30 segundos e evita rate limits da API.

### Escrevendo Testes E2E

#### Teste Básico de Página

```typescript
// e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("deve exibir cards de obras", async ({ page }) => {
    await page.goto("/");

    // Aguardar conteúdo carregar
    await page.waitForSelector('[data-testid="artwork-card"]');

    // Verificar se cards estão visíveis
    const cards = page.locator('[data-testid="artwork-card"]');
    await expect(cards.first()).toBeVisible();
  });
});
```

#### Teste de Fluxo do Usuário

```typescript
// e2e/user-flow.spec.ts
test("deve completar fluxo de navegação de obras", async ({ page }) => {
  // Navegar para homepage
  await page.goto("/");

  // Buscar por obra
  await page.fill('[data-testid="search-input"]', "monet");
  await page.press('[data-testid="search-input"]', "Enter");

  // Clicar no primeiro resultado
  await page.click('[data-testid="artwork-card"]:first-child');

  // Verificar página de detalhes
  await expect(page).toHaveURL(/\/artwork\/\d+/);
  await expect(page.locator("h1")).toBeVisible();
});
```

## Melhores Práticas

### Diretrizes Gerais de Testes

1. **Teste Comportamento do Usuário, Não Implementação**

   ```typescript
   // ✅ Bom - Testa interação do usuário
   await user.click(
     screen.getByRole("button", { name: /adicionar aos favoritos/i }),
   );
   expect(screen.getByText("Adicionado aos favoritos")).toBeInTheDocument();

   // ❌ Ruim - Testa detalhes de implementação
   expect(component.state.isFavorite).toBe(true);
   ```

2. **Use Queries Semânticas**

   ```typescript
   // ✅ Bom - Acessível e semântico
   screen.getByRole("button", { name: /enviar/i });
   screen.getByLabelText(/endereço de email/i);
   screen.getByText(/mensagem de boas-vindas/i);

   // ❌ Ruim - Frágil e não acessível
   screen.getByClassName("submit-btn");
   screen.getByTestId("algum-id-aleatório");
   ```

3. **Teste Casos Extremos e Estados de Erro**

   ```typescript
   test('lida com erros de API adequadamente', async () => {
     // Mock de falha da API
     server.use(
       rest.get('/api/artworks', (req, res, ctx) =>
         res(ctx.status(500))
       )
     )

     render(<ArtworkList />)

     expect(await screen.findByText(/erro ao carregar obras/i)).toBeInTheDocument()
   })
   ```

4. **Use Data Test IDs Com Moderação**
   - Apenas quando queries semânticas não são suficientes
   - Prefixe com nome do componente: `data-testid="artwork-card-image"`

### Diretrizes de Performance

1. **Evite Re-renders Desnecessários em Testes**

   ```typescript
   // ✅ Bom - Wrapper memoizado
   const wrapper = useMemo(() => createTestWrapper(), [])

   // ❌ Ruim - Cria novo wrapper a cada render
   render(<Component />, { wrapper: createTestWrapper() })
   ```

2. **Use Execução Concorrente de Testes**
   ```typescript
   // Executar testes independentes em paralelo
   test.describe.parallel("Testes de Componentes", () => {
     test("teste 1", async () => {
       /* ... */
     });
     test("teste 2", async () => {
       /* ... */
     });
   });
   ```

### Testes de Acessibilidade

```typescript
test("é acessível", async ({ page }) => {
  await page.goto("/artwork/123");

  // Verificar hierarquia de headings
  const h1 = page.locator("h1");
  await expect(h1).toBeVisible();

  // Verificar texto alt das imagens
  const images = page.locator("img");
  for (const image of await images.all()) {
    const alt = await image.getAttribute("alt");
    expect(alt).toBeTruthy();
  }

  // Testar navegação por teclado
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
});
```

## Estrutura de Arquivos

```
art-explorer-react/
├── __tests__/                     # Testes unitários & integração
│   ├── components/
│   │   ├── ui/
│   │   │   └── button.test.tsx
│   │   └── Artwork/
│   │       └── Card/
│   │           └── ArtworkCard.test.tsx
│   ├── hooks/
│   │   └── useDebounce.test.ts
│   └── lib/
│       └── utils.test.ts
├── e2e/                          # Testes end-to-end (simplificados)
│   ├── core-functionality.spec.ts
│   ├── search-basic.spec.ts
│   └── favorites-basic.spec.ts
├── jest.config.js                # Configuração do Jest
├── jest.setup.js                 # Arquivo de setup do Jest
└── playwright.config.ts          # Configuração do Playwright
```

### Convenções de Nomenclatura

- **Testes unitários**: `NomeDoComponente.test.tsx`
- **Testes de hooks**: `useNomeDoHook.test.ts`
- **Testes E2E**: `nome-da-funcionalidade.spec.ts`
- **Test IDs**: `data-testid="componente-elemento"`

## Executando Testes

### Testes Unitários

```bash
# Executar todos os testes unitários
pnpm test

# Executar em modo watch
pnpm test:watch

# Executar com relatório de cobertura
pnpm test:coverage

# Executar arquivo de teste específico
pnpm test button.test.tsx

# Executar testes que correspondem ao padrão
pnpm test --testNamePattern="deve renderizar"
```

### Testes E2E

```bash
# Executar testes e2e simplificados (apenas Chromium - mais rápido)
pnpm test:e2e:fast

# Executar todos os testes e2e
pnpm test:e2e

# Executar teste completo de browsers (quando necessário)
pnpm test:e2e:full

# Executar com modo UI (test runner visual)
pnpm test:e2e:ui

# Executar em modo headed (ver browser)
pnpm test:e2e:headed

# Modo debug (pausar execução)
pnpm test:e2e:debug

# Executar arquivo de teste específico
pnpm test:e2e core-functionality.spec.ts

# Executar em browser específico
npx playwright test --project=chromium
```

## Depurando Testes

### Depuração Jest/RTL

```typescript
// Debugar componente renderizado
import { screen } from '@testing-library/react'

test('exemplo de debug', () => {
  render(<Component />)

  // Imprimir DOM inteiro
  screen.debug()

  // Imprimir elemento específico
  screen.debug(screen.getByRole('button'))

  // Usar queries para inspecionar
  screen.logTestingPlaygroundURL()
})
```

### Depuração Playwright

```typescript
// Pausar execução do teste
await page.pause();

// Tirar screenshot
await page.screenshot({ path: "debug.png" });

// Console log no contexto do browser
await page.evaluate(() => console.log("Info de debug"));

// Reduzir velocidade da execução do teste
test.use({ video: "on-first-retry", trace: "on-first-retry" });
```

### Integração com VS Code

1. Instale as extensões **Jest** e **Playwright Test for VSCode**
2. Use o test runner integrado e capacidades de debug
3. Defina breakpoints diretamente nos arquivos de teste

## Requisitos de Cobertura

- **Cobertura Mínima**: 70% para todas as métricas
- **Componentes Críticos**: 90%+ de cobertura obrigatória
- **Relatórios Gerados**: diretório `coverage/`

### Comandos de Cobertura

```bash
# Gerar relatório de cobertura
pnpm test:coverage

# Visualizar relatório HTML
open coverage/lcov-report/index.html

# Cobertura para CI
pnpm test:ci
```

## Integração Contínua

### Hooks Pre-commit

Testes executam automaticamente em:

- Pre-commit (apenas testes unitários)
- Pre-push (suite completa de testes)

### Pipeline de CI

```bash
# Instalar dependências
pnpm install

# Executar linting
pnpm lint

# Executar testes unitários com cobertura
pnpm test:ci

# Build da aplicação
pnpm build

# Executar testes e2e
pnpm test:e2e
```

## Solucionando Problemas

### Problemas Comuns

1. **Testes com timeout**
   - Aumentar timeout na configuração
   - Verificar loops infinitos ou promises

2. **Testes instáveis**
   - Adicionar esperas adequadas (`waitFor`, `waitForSelector`)
   - Mock de dependências externas
   - Usar fake timers para código dependente de tempo

3. **Erros de import**
   - Verificar Jest moduleNameMapping na config
   - Garantir paths TypeScript corretos

4. **Problemas de browser no Playwright**
   - Executar `npx playwright install` para atualizar browsers
   - Verificar requisitos do sistema

### Obtendo Ajuda

- [Documentação do Jest](https://jestjs.io/docs/getting-started)
- [Documentação do React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Documentação do Playwright](https://playwright.dev/docs/intro)
- [Melhores Práticas de Testes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Próximos Passos

1. **Adicionar test IDs** a elementos críticos da UI
2. **Criar testes de regressão visual** com Playwright
3. **Configurar mocking de API** com MSW
4. **Adicionar testes de performance** com Lighthouse CI
5. **Integrar com GitHub Actions** para testes automatizados

Lembre-se: **Testes são documentação** - eles devem descrever claramente o que seu código faz e dar confiança de que funciona corretamente.
