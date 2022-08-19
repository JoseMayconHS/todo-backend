# TODO BACKEND

Projeto de gerenciamento de tarefas

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

## Mutation

### `type` compartilhados

```graphql
type SimpleOutput {
	ok: Boolean
}
```

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

- Login de usuário

  ```graphql
  input LoginInput {
  	email: String!
  	password: String!
  }

  type LoginOutput {
  	data: User!
  	token: String!
  }

  type Mutation {
  	login(data: LoginInput): LoginOutput
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

`MONGO_URL`

`MONGO_DBNAME`
