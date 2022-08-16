import { WorkspaceModel } from '@models/WorkspaceModel/WorkspaceModel'
import { UserRepositoryContract } from './UserRepository'

export interface CreateWorkspaceDTO extends Omit<WorkspaceModel, '_id'> {}

export interface WorkspaceRepositoryContract {
	userRepository: UserRepositoryContract
	workspaceCreate(data: CreateWorkspaceDTO, user_id: string): Promise<string>
	workspaceUpdate(
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void>
	workspaceDelete(workspace_id: string, user_id: string): Promise<void>
	workspaceGetByUser(user_id: string): Promise<WorkspaceModel[]>
	workspaceGetByID(
		workspace_id: string,
		user_id: string
	): Promise<WorkspaceModel>
}
