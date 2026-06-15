# StackStore - Projeto Final C216

E-commerce simples desenvolvido para o projeto final, com frontend em Next.js, backend em NestJS, persistência em PostgreSQL e orquestração via Docker Compose.

## Estrutura do projeto

- `frontend/`: aplicação web com Next.js, React e Tailwind CSS.
- `backend/`: API REST com NestJS, TypeORM, PostgreSQL e testes Jest.
- `docker-compose.yml`: orquestração dos serviços `web`, `api` e `db`.

## Funcionalidades

- Home com resumo do projeto e produtos em destaque.
- Catálogo de produtos por categorias.
- Carrinho com criação real de pedido via API.
- Painel administrativo protegido por senha com estoque, categorias, pedidos e cadastro de produtos com imagem local.
- API REST com CRUD de produtos, categorias e clientes, além de fluxo de pedidos.
- Documentação interativa da API com Swagger.

## Stack

- Frontend: Next.js, React, Tailwind CSS.
- Backend: NestJS, TypeORM, Node.js.
- Banco: PostgreSQL.
- Testes: Jest.
- Containers: Docker e Docker Compose.

## Modelo de dados

- `categories` 1:N `products`.
- `customers` 1:N `orders`.
- `orders` N:M `products` por meio de `order_items`.

Tabelas principais:

- `categories`: categorias do catálogo.
- `products`: produtos, preço, estoque e categoria.
- `customers`: clientes usados nos pedidos.
- `orders`: pedidos e status.
- `order_items`: itens do pedido, quantidade e preço unitário.

## Checklist do projeto final

- Backend: NestJS com Node.js.
- Testes do backend: Jest.
- Frontend: Next.js com React e Tailwind CSS.
- Persistência: PostgreSQL.
- Docker Compose: `web`, `api` e `db`.
- Frontend com mais de 3 telas: Home, Catálogo, Carrinho e Admin.
- Admin com senha de demonstração: `admin123`.
- Banco com mais de 2 tabelas: 5 tabelas principais.
- Mais de 10 operações REST: produtos, categorias, clientes e pedidos.
- Métodos REST contemplados: GET, POST, PUT e DELETE.
- Relação N:1: produtos pertencem a uma categoria; pedidos pertencem a um cliente.
- Relação N:M: pedidos possuem muitos produtos e produtos podem aparecer em muitos pedidos por meio de `order_items`.
- README com execução, rotas, modelo de dados, logs e boas práticas.

## Rotas REST principais

As rotas tambem podem ser visualizadas e testadas pelo Swagger:

```bash
http://localhost:3001/docs
```

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`
- `GET /categories`
- `POST /categories`
- `PUT /categories/:id`
- `DELETE /categories/:id`
- `GET /customers`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id`
- `GET /orders`
- `GET /orders/:id`
- `POST /orders`
- `PUT /orders/:id/status`
- `DELETE /orders/:id`

Essas rotas cobrem GET, POST, PUT e DELETE, com mais de 10 operações no backend.

## Execução com Docker Compose

```bash
docker compose up --build
```

Serviços:

- Frontend: http://localhost:3003
- Swagger: http://localhost:3001/docs

O backend cria as tabelas automaticamente e executa um seed inicial com categorias e produtos quando o banco está vazio.

Credencial do Admin:

- Senha: `admin123`

## Execução local sem Docker

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Variáveis úteis:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
API_INTERNAL_URL=http://localhost:3001
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=stackstore
```

## Testes

Testes unitários do backend:

```bash
cd backend
npm test
```

Testes e2e do backend:

```bash
cd backend
npm run test:e2e
```

## Logs para demonstração

O backend gera logs no console e também salva em arquivo em `backend/logs/app.log`.
Essa pasta é montada como volume no container da API, então o arquivo fica acessível no projeto local enquanto o Docker Compose está rodando.

Com o Compose rodando, acompanhar logs em tempo real:

```bash
docker compose logs -f api
docker compose logs -f web
docker compose logs -f db
```

Ver o arquivo salvo:

```bash
tail -f backend/logs/app.log
```

## Boas praticas aplicadas

- DTOs com validação no backend.
- Separação por módulos no NestJS.
- Relacionamentos explícitos no banco.
- Seed automático para facilitar avaliação.
- Frontend separado em componentes e cliente de API.
- Docker Compose com healthcheck do PostgreSQL.
