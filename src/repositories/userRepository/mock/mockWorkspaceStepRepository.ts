import { UserRepositoryContract } from '../UserRepository'

import {
	CreateStepDTO,
	WorkspaceStepRepositoryContract,
} from '../WorkspaceStepRepository'

export class MockWorkspaceStepRepository
	implements WorkspaceStepRepositoryContract
{
	constructor(private UserRepository: UserRepositoryContract) {}

	async workspaceStepCreate(
		data: CreateStepDTO,
		workspace_id: string,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		const step = user.addStepToWorkspace(workspace_id, data)

		return step._id
	}

	async workspaceStepUpdate(
		step_id: string,
		workspace_id: string,
		user_id: string,
		data: Partial<CreateStepDTO>
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		user.updateStepInWorkspace(step_id, workspace_id, data)
	}
	async workspaceStepDelete(
		step_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		user.deleteStepInWorkspace(step_id, workspace_id)
	}
}
