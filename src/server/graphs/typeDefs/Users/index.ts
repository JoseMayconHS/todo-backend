import { gql } from 'apollo-server'

import { LoginUserResponse } from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

export type RegisterOutput = {
	ok: boolean
	_id?: string
	message: string
}

const UserRegisterTypeDefs = gql`
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
`

export type LoginOutput = LoginUserResponse

const UserLoginTypeDefs = gql`
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
`

export type SimpleOutput = {
	ok: boolean
}

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
	type SimpleOutput {
		ok: Boolean
	}

	type Step {
		_id: ID!
		label: String!
		index: Int!
	}

	type Member {
		_id: ID!
		name: String!
		email: String!
	}

	type Checklist {
		_id: ID!
		description: String!
		done: Boolean!
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

	type User {
		name: String!
		email: String!
		workspaces: [Workspace]!
		created_at: String!
		update_at: String!
	}

	${UserRegisterTypeDefs}
	${UserLoginTypeDefs}
	${UserDeleteTypeDefs}
	${UserUpdateTypeDefs}
`
