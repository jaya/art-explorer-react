# Art Explorer - Desafio Front-end com React + The Met Museum API

## 🌟 Objetivo

Criar uma aplicação web responsiva utilizando **React**, **TypeScript** e **Node.js** (para o backend), com o objetivo de explorar obras de arte da coleção do Metropolitan Museum of Art (The Met). O sistema deve permitir:

* Buscar obras com imagem
* Visualizar detalhes das obras
* Marcar como favorita
* Listar favoritas

---

## 🔍 Funcionalidades Requeridas

### 1. **Listagem de Obras com Imagem**

* Utilizar a API: `GET /public/collection/v1/search?hasImages=true&q=painting`
* Simular paginação (15 por vez) usando slices do array de `objectIDs`

### 2. **Detalhes de Obra**

* Buscar detalhes de uma obra: `GET /public/collection/v1/objects/{objectID}`
* Exibir: imagem, título, artista, data, técnica, departamento, link para o site oficial

### 3. **Favoritar Obras**

* Botão para marcar/desmarcar favoritos
* Persistir localmente (no browser usando `localStorage` ou `IndexedDB`)

### 4. **Listar Favoritas**

* Seção ou página dedicada para exibir as obras favoritadas

### 5. **Interface Responsiva**

* Design responsivo (preferîncialmente com TailwindCSS ou CSS Modules)
* Scroll infinito ou botão "carregar mais"

---

## 🚀 Stack Tecnológica

* **Frontend:** React + TypeScript + Axios + TailwindCSS (ou equivalente)
* **Backend (opcional):** Node.js + Express (poderá ser usado como proxy de requisições ou para features futuras)

---

## 🔗 Endpoints da API do The Met Museum

| Funcionalidade             | Endpoint                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| Buscar obras com imagens   | `GET /public/collection/v1/search?hasImages=true&q=painting`       |
| Detalhes de uma obra       | `GET /public/collection/v1/objects/{objectID}`                     |
| Buscar por artista/cultura | `GET /public/collection/v1/search?artistOrCulture=true&q=van+gogh` |
| Listar departamentos       | `GET /public/collection/v1/departments`                            |
| Buscar por departamento    | `GET /public/collection/v1/search?departmentId=11&q=portrait`      |

---

## 📊 Requisitos Desejáveis

* Barra de busca com autocomplete
* Filtro por departamento ou artista
* Animações com Framer Motion
* Dark mode
* Deploy (ex: Vercel/Netlify para frontend, Render para backend)

---

## ⌚ Diagrama de Sequência (Mermaid)

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant LocalStore
    participant MetAPI

    User->>UI: Scroll até o fim da lista
    UI->>MetAPI: GET /search?hasImages=true&q=painting
    MetAPI-->>UI: Retorna lista de objectIDs
    loop Para cada objectID (15 por página)
        UI->>MetAPI: GET /objects/{objectID}
        MetAPI-->>UI: Detalhes da obra
    end
    User->>UI: Marca obra como favorita
    UI->>LocalStore: Salva objeto nos favoritos
    User->>UI: Vai para "favoritas"
    UI->>LocalStore: Recupera favoritos
```

---

## 📆 Entrega

1. **Fork do Repositório Base**
2. **Crie uma Branch com seu Nome (snake\_case)**

   ```bash
   git checkout -b joao_silva_souza
   ```
3. **Implemente e Suba o Projeto**

   ```bash
   git add .
   git commit -m "Entrega desafio frontend - João Silva Souza"
   git push origin joao_silva_souza
   ```
4. **Abra um Pull Request** para a branch `main`

   * Título: `Entrega - joao_silva_souza`
   * Corpo: nome, data, observações opcionais

---

## 📚 Extras

* Pode usar bibliotecas como React Query, Zustand, Redux, etc.
* Não é necessário criar backend se não for preciso, mas é bem-vindo caso deseje mostrar arquitetura completa.
* Bonus: testes com Jest + React Testing Library

---

## 🎓 Licença

Dados públicos da API do The Met sob [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)

---

## 📢 Contato

* Autor: Leandro Costa
* Email: [leandro@jaya.tech](mailto:leandro@jaya.tech)
