import { WorkspaceModel } from '@models/WorkspaceModel/WorkspaceModel'

export interface CreateWorkspaceDTO extends Omit<WorkspaceModel, '_id'> {}

export interface WorkspaceRepositoryContract {
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
