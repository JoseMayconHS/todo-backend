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
