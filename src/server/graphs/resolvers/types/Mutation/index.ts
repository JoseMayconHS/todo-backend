import { UserMutation } from './User'
import { WorkspaceMutation } from './Workspace'

export const Mutation = {
	...UserMutation,
	...WorkspaceMutation,
}
