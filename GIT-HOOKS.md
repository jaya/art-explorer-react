# Git Hooks & Workflow de Testes

Este projeto utiliza git hooks automatizados para garantir qualidade de código e cobertura de testes antes de commits e pushes.

## 🔗 Visão Geral dos Git Hooks

### Hook Pre-commit

**Executa em**: `git commit`
**Objetivo**: Validação rápida dos arquivos staged
**Verificações**:

- ✅ Formatação de código (Prettier)
- ✅ Linting (ESLint)
- ✅ Testes unitários para arquivos alterados
- ✅ Verificação rápida de saúde

### Hook Pre-push

**Executa em**: `git push`
**Objetivo**: Validação abrangente antes de compartilhar código
**Verificações**:

- ✅ Build do projeto
- ✅ Suite completa de testes unitários com cobertura
- ✅ Testes end-to-end
- ✅ Todas as validações de qualidade

### Hook de Mensagem de Commit

**Executa em**: `git commit`
**Objetivo**: Garantir formato convencional de commit
**Valida**: Formato da mensagem de commit (commitlint)

## 🚀 Comandos do Workflow

```bash
# Workflow de desenvolvimento
pnpm test:watch          # Executa testes em modo watch durante desenvolvimento
pnpm test:coverage       # Verifica cobertura atual
pnpm lint               # Executa linter manualmente

# Pre-commit (automático)
git add .
git commit -m "feat: adiciona nova funcionalidade"
# → Executa formatação, linting, testes nos arquivos staged

# Pre-push (automático)
git push
# → Executa suite completa de testes + build + testes e2e

# Validação manual (mesmo que pre-push)
pnpm validate           # lint + test:ci + build
pnpm test:all          # test:ci + test:e2e
```

## 📋 O Que é Testado e Quando

### Em Arquivos Staged (Pre-commit)

```bash
**/*.{js,jsx,ts,tsx} files:
├── prettier --write     # Formatar código
├── eslint --fix        # Corrigir problemas de linting
└── jest --findRelatedTests  # Testar apenas arquivos relacionados

**/*.{json,md,yml,yaml} files:
└── prettier --write     # Formatar arquivos de markup
```

### No Push (Pre-push)

```bash
1. pnpm build           # Garantir que o projeto compila
2. pnpm test:ci         # Testes unitários + cobertura (limite de 70%)
3. pnpm test:e2e        # Testes end-to-end
```

## ⚡ Otimizações de Performance

- **Teste de arquivos staged**: Testa apenas arquivos relacionados às mudanças
- **Execução paralela**: Testes executam concorrentemente quando possível
- **Cache inteligente**: Jest usa cache inteligente
- **Limite de cobertura**: Aplicado apenas no push, não no commit

## 🛠️ Solucionando Problemas

### Falhas no Pre-commit

```bash
# Problemas de formatação
❌ Formatação do Prettier falhou
💡 Execute: pnpm exec prettier --write .

# Problemas de linting
❌ Erros do ESLint encontrados
💡 Execute: pnpm lint --fix

# Falhas nos testes
❌ Testes falharam para arquivos staged
💡 Execute: pnpm test:watch e corrija os testes que falharam
```

### Falhas no Pre-push

```bash
# Problemas de build
❌ Build falhou
💡 Execute: pnpm build e corrija erros de TypeScript/build

# Problemas de cobertura
❌ Cobertura abaixo do limite de 70%
💡 Adicione testes para aumentar a cobertura

# Falhas nos testes E2E
❌ Testes E2E falharam
💡 Execute: pnpm test:e2e:headed para debugar visualmente
```

## 🔧 Personalizando Limites

### Requisitos de Cobertura (jest.config.js)

```javascript
coverageThreshold: {
  global: {
    branches: 70,    // Ajuste conforme necessário
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Pular Hooks (Apenas Emergências)

```bash
# Pular pre-commit (não recomendado)
git commit --no-verify -m "correção emergencial"

# Pular pre-push (não recomendado)
git push --no-verify
```

## 📊 Relatórios de Cobertura

```bash
# Gerar relatório de cobertura
pnpm test:coverage

# Visualizar relatório HTML
start coverage/lcov-report/index.html  # Windows
open coverage/lcov-report/index.html   # macOS
```

## 🎯 Benefícios

- **Qualidade de Código Consistente**: Formatação e linting automáticos
- **Prevenir Código Quebrado**: Testes executam antes do código ser compartilhado
- **Feedback Rápido**: Testa apenas o que mudou no commit
- **Validação Abrangente**: Suite completa executa antes do push
- **Padrões de Equipe**: Commits convencionais obrigatórios
- **Confiança**: Saber que seu código funciona antes de compartilhar

## ⚙️ Localização dos Arquivos de Hook

```
.husky/
├── pre-commit     # Validação rápida de arquivos staged
├── pre-push       # Testes abrangentes
└── commit-msg     # Validação de formato de commit
```

---

**Lembre-se**: Os hooks ajudam a manter a qualidade automaticamente. Se estão falhando frequentemente, considere melhorar a cobertura de testes ou corrigir problemas subjacentes ao invés de contorná-los.
