# Art Explorer

## Descrição

Art Explorer é uma aplicação web que permite explorar obras de arte da coleção do Metropolitan Museum of Art (The Met). As principais funcionalidades são:

- Buscar obras com imagem
- Visualizar detalhes das obras
- Marcar como favorita
- Listar favoritas
- Procurar obras por departamento ou artista

## Preview

![Art Explorer Preview](./.public/preview.png)

## Tecnologias

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Axios](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Hook Form](https://react-hook-form.com/)
- [Nuqs](https://nuqs.dev/)
- [Zod](https://zod.dev/)
- [Motion](https://motion.dev/)
- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)
- [Biome](https://biomejs.dev/)

## API do The Met Museum

- [The Met Museum API](https://metmuseum.github.io/)

## Rodando o projeto

```bash
# Instalar dependências
pnpm install

# Rodar o projeto
pnpm dev
```

## Decisões de Arquitetura

- **Framework Escolhido:** Next.js
  - Utilizado por oferecer renderização híbrida (SSG e SSR), roteamento baseado em arquivos, ótima integração com React Server Components e performance otimizada por padrão.
- **Home Page:** Gerada estaticamente no build (SSG) para acelerar a entrega inicial e reduzir chamadas à API do The Met.
  - A primeira página é gerada server-side, a partir da segunda página é feito fetch dos dados no client-side.
- **Organização do Projeto:** Estrutura orientada a features (`modules/`), com separação clara entre `actions`, `hooks`, `views`, `store`, etc.
- **Gerenciamento de Estado:** Utilização de `Zustand` para controle leve de favoritos e tema, mantendo a simplicidade e performance.
- **Fetch de Dados:** Implementado com `React Query` + `server actions`.
- **Estilização:** Utilização de `TailwindCSS` + `shadcn UI`, garantindo produtividade e consistência visual.
- **Formulários e validação:** Utilização de `React Hook Form` + `Zod`, garantindo performance e regras claras de validação.
- **Navegação:** `Nuqs` para gerenciamento de query params, mantendo a URL amigável e o histórico do navegador.
- **Testes:** `Vitest` para testes unitários e `React Testing Library` para testes de interface. `Playwright` para testes de integração.
- **Linter e Formatação:** `Biome` para garantir consistência e produtividade.

## Observabilidade

O projeto inclui mecanismos básicos de observabilidade com foco em extensibilidade futura:

- **Tratamento de erros centralizado:**
  Toda falha em chamadas assíncronas (como fetch em server actions) é capturada pela função `handleError()`, que atualmente usa `console.error` e já está preparada para integrar ferramentas como [Sentry](https://sentry.io), [LogRocket](https://logrocket.com) ou [Datadog](https://www.datadoghq.com).

- **Logger de eventos do usuário:**
  Eventos como mudança de tema, adição/remoção de favoritos, cliques em links do menu e navegação entre páginas são pontos onde o logger será aplicado.
  A função `logger()` já está estruturada para capturar o tipo de evento, contexto (rota atual), payload relevante, e pode ser facilmente integrada com ferramentas de rastreamento de erros.

- **Exemplo de evento logado:**
  ```ts
  logger('info', 'click:menuLink', { from: '/home', to: '/favorites' })
  logger('info', 'favorite:add', { objectID: 123, title: 'Starry Night' })

## Melhorias que podem ser implementadas

- [ ] Integração com ferramentas de rastreamento de erros
- [ ] Deixar o fetch mais robusto, adicionando um novo objectID caso alguma promise seja rejeitada, retornando assim um array com 15 itens
- [ ] Adicionar um botão para limpar buscas
- [ ] Adicionar traduções com i18n
- [ ] Adicionar testes unitários para componentes visuais
