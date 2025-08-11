# Decisões de Arquitetura - Art Explorer React

Este documento registra as principais decisões técnicas implementadas no Art Explorer, baseado no código efetivamente construído.

## 🎯 Stack Tecnológica Implementada

### Tecnologias Core Escolhidas

- **Next.js 15.4.6** com App Router - Framework React moderno
- **React 19.1.0** - Biblioteca para interfaces
- **TypeScript 5** - Tipagem estática rigorosa (strict mode)
- **Tailwind CSS 4** - Framework CSS utility-first
- **Zustand 5.0.7** - Gerenciamento de estado global
- **TanStack Query 5.84.2** - Cache e sincronização de dados

### UI/UX e Componentes

- **shadcn/ui** - Sistema de design com Radix UI primitives
- **Framer Motion 12.23.12** - Animações e transições
- **Lucide React** - Biblioteca de ícones
- **next-themes** - Sistema de temas dark/light
- **class-variance-authority (CVA)** - Gerenciamento de variantes de classe

### Qualidade e Testes

- **Jest 30** - Framework de testes unitários
- **React Testing Library** - Testes de componentes
- **Playwright** - Testes end-to-end
- **ESLint 9 + Prettier** - Linting e formatação
- **Husky + lint-staged** - Git hooks automatizados
- **Commitlint** - Padronização de commits convencionais

---

## 🏗️ Decisões de Implementação

### 1. App Router do Next.js 15

**Implementado**: Estrutura com App Router ao invés do Pages Router.

**Estrutura criada**:

```
app/
├── (home)/              # Grupo de rotas da home
├── artwork/[id]/        # Página dinâmica de detalhes
├── favorites/           # Página de favoritos
├── layout.tsx          # Layout raiz
└── globals.css         # Estilos globais
```

**Benefícios observados**:

- Co-location de componentes e páginas
- Layouts aninhados simplificados
- Server Components por padrão

### 2. Estado Híbrido: TanStack Query + Zustand

**Implementado**: Separação clara entre server state e client state.

```typescript
// TanStack Query para dados da API (lib/api.ts)
export class MetMuseumAPI {
  static async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
    // Implementação com retry automático
  }
}

// Zustand para estado da aplicação (stores/useArtworkStore.ts)
export const useArtworkStore = create<ArtworkStore>((set, get) => ({
  searchQuery: "",
  searchResults: [],
  loadedArtworks: new Map(),
  // ... estado de paginação e cache
}));
```

**Vantagens implementadas**:

- Cache inteligente em múltiplas camadas
- Separação de responsabilidades clara
- DevTools para debugging

### 3. Sistema de Favoritos com localStorage

**Implementado**: Gerenciamento de favoritos com persistência local.

```typescript
// lib/favorites.ts
export class FavoritesManager {
  static addFavorite(artwork: FavoriteArtwork) {
    const favorites = this.getFavorites();
    favorites.push(artwork);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  }
}

// hooks/useFavorites.ts
export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteArtwork[]>([]);
  // Sincronização com eventos customizados
}
```

### 4. Cache Multi-camadas

**Implementado**: Sistema de cache em 3 níveis.

```typescript
// 1. Next.js fetch cache
const response = await fetch(url, {
  next: { revalidate: 3600 },
});

// 2. TanStack Query cache
const { data } = useQuery({
  queryKey: ["artwork", id],
  queryFn: () => api.getArtwork(id),
  staleTime: 5 * 60 * 1000,
});

// 3. Zustand store cache
const { loadedArtworks, cacheArtwork } = useArtworkStore();
```

### 5. Batch Loading de 15 Itens

**Implementado**: Carregamento em lotes para otimização.

```typescript
// components/Artwork/Grid/ArtworkGrid.tsx
const BATCH_SIZE = 15;
const loadBatch = async (objectIDs: number[], startIndex: number) => {
  const batch = objectIDs.slice(startIndex, startIndex + BATCH_SIZE);
  // Implementação com Promise.allSettled
};
```

**Motivos**:

- Rate limiting da API do The Met
- Performance melhor em carregamento progressivo
- UX responsiva

---

## 🎨 Implementações de UI/UX

### 1. Grid Responsivo

**Implementado**: Layout adaptativo de 1-5 colunas.

```css
/* Implementado no ArtworkGrid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5
```

### 2. Skeleton Loading

**Implementado**: Componentes de skeleton com animação pulse.

```typescript
// components/Artwork/Card/ArtworkCardSkeleton.tsx
export const ArtworkCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-muted aspect-[3/4] rounded-lg" />
    <div className="mt-2 space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  </div>
);
```

### 3. Sistema de Temas

**Implementado**: Temas com CSS custom properties.

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

**Implementado com**:

- next-themes para gerenciamento
- Toggle na navbar
- Persistência automática

---

## 🔧 Implementações Técnicas

### 1. TypeScript Rigoroso

**Configurado**: Strict mode com regras adicionais.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
    // ... outras regras rigorosas
  }
}
```

### 2. API com Retry Logic

**Implementado**: Retry automático com backoff exponencial.

```typescript
// lib/api.ts
private static async fetchWithRetry<T>(url: string, retries = 3): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. Debounced Search

**Implementado**: Hook useDebounce com 500ms de delay.

```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### 4. Otimização de Imagens

**Implementado**: Next.js Image com otimizações.

```typescript
// components/Artwork/Card/ArtworkCard.tsx
<Image
  src={primaryImageSmall || primaryImage}
  alt={title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
/>
```

---

## 🧪 Implementações de Testes

### 1. Estratégia Simplificada de E2E

**Implementado**: Testes focados em core functionality.

```typescript
// e2e/core-functionality.spec.ts
test("deve exibir cards de obras", async ({ page }) => {
  await page.goto("/");
  await page.waitForSelector('[data-testid="artwork-card"]');
  const cards = page.locator('[data-testid="artwork-card"]');
  await expect(cards.first()).toBeVisible();
});
```

**Abordagem escolhida**:

- Testes rápidos (~30s vs ~10min)
- Menos dependência da API externa
- Foco em funcionalidade crítica

### 2. Testes Unitários Abrangentes

**Implementado**: Cobertura de 70% configurada.

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
  },
}
```

---

## 🚀 Otimizações Implementadas

### 1. Bundle Optimization

**Configurado**: Otimizações no next.config.ts.

```typescript
// next.config.ts
const config = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    domains: ["images.metmuseum.org"],
  },
};
```

### 2. Tree Shaking

**Implementado**: Imports específicos em todo o código.

```typescript
// ✅ Implementado
import { Button } from "@/components/ui/button";
import { Heart, Search } from "lucide-react";

// ❌ Evitado
import * as UI from "@/components/ui";
```

---

## 🔍 Lições Aprendidas

### 1. **The Met API é Inconsistente**

- Alguns objetos não têm imagens mesmo com `hasImages=true`
- Rate limiting não é bem documentado
- **Solução**: Defensive programming em todos os lugares

### 2. **Next.js App Router Still Evolving**

- Algumas bibliotecas não funcionam com Server Components
- Debugging pode ser mais difícil
- **Solução**: Fallbacks para Client Components quando necessário

### 3. **Performance vs Feature Trade-offs**

- Cada nova feature pode impactar performance
- Necessário medir sempre (Lighthouse, Core Web Vitals)
- **Solução**: Performance budget e monitoramento contínuo

### 4. **TypeScript se paga no longo prazo**

- Setup inicial mais lento
- Refactoring seguro vale o investimento
- **Solução**: Strict mode desde o início

---

## 🔮 Melhorias Futuras

### Technical Debt Identificado

1. **Error Handling** - Mais granular por tipo de erro
2. **Loading States** - Mais específicos por contexto
3. **Bundle Analysis** - Monitoramento automatizado
4. **Performance Monitoring** - Métricas em produção
5. **Storybook** - Documentação de componentes

### Features Consideradas

1. **Virtual Scrolling** - Para listas muito grandes
2. **Offline Support** - Service Worker
3. **Filtros Avançados** - Por século, estilo, etc.
4. **Social Features** - Compartilhamento
5. **Analytics** - Comportamento do usuário

---

## 📊 Como Medir Performance

Para acompanhar métricas reais:

```bash
# Lighthouse CI
pnpm add -g @lhci/cli
lhci autorun

# Bundle Analyzer
pnpm add --save-dev @next/bundle-analyzer
ANALYZE=true pnpm build

# Web Vitals em produção
pnpm add web-vitals
```

---

2025, Jonathas Germano de Oliveira
