import { gql } from 'apollo-server'
import { SimpleOutput } from '..'

export type WorkspaceCreateOutput = SimpleOutput & {
	_id?: string
}

export type WorkspaceCreateInput = SimpleOutput & {
	title: string
	members_id: string[]
	favorite: boolean
	description: string
}

const WorkspaceCreateTypeDefs = gql`
	input WorkspaceCreateInput {
		title: String!
		members_id: [String]
		favorite: Boolean
		description: String
	}

	type WorkspaceCreateOutput implements ISimpleOutput {
		_id: ID
		ok: Boolean!
		message: String
	}

	type Mutation {
		createWorkspace(data: WorkspaceCreateInput): WorkspaceCreateOutput
	}
`

const WorkspaceRemoveTypeDefs = gql`
	type Mutation {
		removeWorkspace(workspace_id: ID!): SimpleOutput
	}
`

const WorkspaceUpdateTypeDefs = gql`
	input UpdateWorkspaceInput {
		title: String
		favorite: Boolean
		description: String
	}

	type Mutation {
		updateWorkspace(workspace_id: ID!, data: UpdateWorkspaceInput): SimpleOutput
	}
`

export const WorkspaceTypeDefs = gql`
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

	${WorkspaceRemoveTypeDefs}
	${WorkspaceCreateTypeDefs}
	${WorkspaceUpdateTypeDefs}
`
