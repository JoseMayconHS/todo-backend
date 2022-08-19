import { gql } from 'apollo-server'

export type RegisterOutput = {
	ok: boolean
	_id?: string
	message: string
}

export const UserTypeDefs = gql`
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
