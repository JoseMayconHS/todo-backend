import { gql } from 'apollo-server'

import { LoginUserResponse } from '@useCases/User/LoginUserUseCase/LoginUserUseCase'
import { SimpleOutput } from '..'

export type RegisterOutput = SimpleOutput & {
	_id?: string
}

const UserRegisterTypeDefs = gql`
	input RegisterInput {
		email: String!
		name: String!
		password: String!
	}

	type RegisterOutput implements ISimpleOutput {
		ok: Boolean!
		message: String
		_id: ID
	}

	type Mutation {
		register(data: RegisterInput): RegisterOutput
	}
`

export type PayloadOutput = LoginUserResponse

const UserLoginTypeDefs = gql`
	input LoginInput {
		email: String!
		password: String!
	}

	type Query {
		login(data: LoginInput): PayloadOutput
	}
`

const UserFindByIdTypeDefs = gql`
	type Query {
		findUserByID(_id: ID!): User
	}
`

const UserReconnectTypeDefs = gql`
	type Query {
		reconnect: PayloadOutput
	}
`

const UserLogoutTypeDefs = gql`
	type Query {
		logout: SimpleOutput
	}
`

const UserDeleteTypeDefs = gql`
	type Mutation {
		removeUser: SimpleOutput
	}
`

const UserUpdateTypeDefs = gql`
	input UpdateUserInput {
		name: String
		email: String
		password: String
	}

	type Mutation {
		updateUser(data: UpdateUserInput): SimpleOutput
	}
`

export const UserTypeDefs = gql`
	type User {
		_id: ID!
		name: String!
		email: String!
		workspaces: [Workspace]!
		created_at: String!
		update_at: String!
	}

	type PayloadOutput {
		data: User!
		token: String!
	}

	${UserRegisterTypeDefs}
	${UserLoginTypeDefs}
	${UserLogoutTypeDefs}
	${UserDeleteTypeDefs}
	${UserUpdateTypeDefs}
	${UserFindByIdTypeDefs}
	${UserReconnectTypeDefs}
`
