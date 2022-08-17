import { Step } from '@models/WorkspaceModel/WorkspaceModel'

export type CreateStepDTO = Omit<Step, '_id'>

export interface WorkspaceStepRepositoryContract {
	workspaceStepCreate(
		data: CreateStepDTO,
		workspace_id: string,
		user_id: string
	): Promise<string>
	workspaceStepUpdate(
		step_id: string,
		workspace_id: string,
		user_id: string,
		data: Partial<CreateStepDTO>
	): Promise<void>
	workspaceStepDelete(
		step_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
}
