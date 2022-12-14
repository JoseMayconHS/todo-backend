# TODO BACKEND

Aplicação de gerenciamento de tarefas desenvolvido em Graphql.

## Efeitos colaterais

- O token é revogado ao fazer a consulta `reconnect` e `logout`. `reconnect` retorna um novo token;

- Tokens revogados são tirados da lista negra todos os dias a meia-noite.

## Estrutura de dados

```typescript
  // Objeto de entrada
  type User = {
    _id: string
    name: string
    email: string
    password: string
    workspaces: Workspace[]
  }

  type Workspace = {
    _id: string
    title: string
    members_id: string<User._id>[]
    favorite: boolean
    description: string
    tasks: Task[]
    steps: Step[]
  }

  type Step = {
    _id: string
    label: string
    index: number
  }

  type Task = {
    _id: string
    step_id: string<Step._id>
    priority: 1 | 2 | 3
    members_id: string<User._id>[]
    title: string
    description: string
    doneAt: Date
    checklist: Checklist[]
  }

  type Checklist = {
    _id: string
    description: string
    done: boolean
  }
```

## Grafo de usuário

```graphql
type User {
	_id: ID!
	name: String!
	email: String!
	workspaces: [Workspace]!
	created_at: String!
	update_at: String!
}

type Workspace {
	_id: String!
	title: String!
	members_id: [Member]!
	favorite: Boolean!
	description: String!
	tasks: [Task]!
	steps: [Step]!
	created_at: String!
	update_at: String!
}

type Step {
	_id: ID!
	label: String!
	index: Int!
}

type Task {
	_id: ID!
	step_id: [ID]!
	priority: Int!
	members_id: [Member]!
	title: String!
	description: String!
	doneAt: Int
	checklist: [Checklist]!
	created_at: String!
	update_at: String!
}

type Checklist {
	_id: ID!
	description: String!
	done: Boolean!
}

type Member {
	_id: ID!
	name: String!
	email: String!
}
```

### `type` compartilhados

```graphql
type SimpleOutput {
	ok: Boolean
	message: String
}

type PayloadOutput {
	data: User!
	token: String!
}
```

## Mandar token no cabeçalho da requisições

```typescript
  {
    'Authorization': 'Bearer <token>'
  }
```

## Query

- Login de usuário

  ```graphql
  input LoginInput {
  	email: String!
  	password: String!
  }

  type Query {
  	login(data: LoginInput): PayloadOutput
  }
  ```

- Logout do usuário **(Requer token)**

  ```graphql
  type Query {
  	logout: SimpleOutput
  }
  ```

- Reconexão do usuário **(Requer token)**

  ```graphql
  type Query {
  	reconnect: PayloadOutput
  }
  ```

- Encontrar usuário por ID **(Requer token)**

  ```graphql
  type Query {
  	findUserByID(_id: ID!): User
  }
  ```

---

## Mutation

- Cadastro de usuário

  ```graphql
  input RegisterInput {
  	email: String!
  	name: String!
  	password: String!
  }

  type RegisterOutput {
  	ok: Boolean!
  	_id: ID
  	message: String
  }

  type Mutation {
  	register(data: RegisterInput): RegisterOutput
  }
  ```

- Remover usuário **(Requer token)**

  ```graphql
  type Mutation {
  	removeUser: SimpleOutput
  }
  ```

- Atualizar usuário **(Requer token)**

  ```graphql
  input UpdateUserInput {
  	name: String
  	email: String
  	password: String
  }

  type Mutation {
  	updateUser(data: UpdateUserInput): SimpleOutput
  }
  ```

---

- Adicionar workspace **(Requer token)**

  ```graphql
  input WorkspaceCreateInput {
  	title: String!
  	members_id: [String]
  	favorite: Boolean
  	description: String
  }

  type WorkspaceCreateOutput {
  	_id: ID
  	ok: Boolean!
  	message: String
  }

  type Mutation {
  	createWorkspace(data: WorkspaceCreateInput): WorkspaceCreateOutput
  }
  ```

- Atualizar workspace **(Requer token)**

  ```graphql
  input UpdateWorkspaceInput {
  	title: String
  	favorite: Boolean
  	description: String
  }

  type Mutation {
  	updateWorkspace(
  		workspace_id: ID!
  		data: UpdateWorkspaceInput!
  	): SimpleOutput
  }
  ```

- Remover workspace **(Requer token)**

  ```graphql
  type Mutation {
  	removeWorkspace(workspace_id: ID!): SimpleOutput
  }
  ```

---

## Ambiente configurado com Docker

```bash
  docker-compose up -d
```

## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm run test
```

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`PORT`

`NODE_ENV`

`JWT_SECRET`

`MONGO_URL` - `MONGO_DBNAME` - `MONGO_USER` - `MONGO_PASS`

`REDIS_HOST` - `REDIS_PORT` - `REDIS_USER` - `REDIS_PASS`
