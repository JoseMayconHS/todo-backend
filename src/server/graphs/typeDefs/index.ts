import { gql } from 'apollo-server'

import { UserTypeDefs } from './Users'
import { WorkspaceTypeDefs } from './Workspaces'

export type SimpleOutput = {
	ok: boolean
	message?: string
}

/**
 * (END) CRIAR DEFINIÇÕES DE TIPOS DE WORKSPACE
 */

export default gql`
	interface ISimpleOutput {
		ok: Boolean!
		message: String
	}

	type SimpleOutput implements ISimpleOutput {
		ok: Boolean!
		message: String
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

	${WorkspaceTypeDefs}
	${UserTypeDefs}
`
