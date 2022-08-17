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

		const index = user.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const workspace = user.workspaces[index]

			const step_index = workspace.steps.findIndex(
				(step) => step._id === step_id
			)

			if (step_index !== -1) {
				const newStep = {
					...workspace.steps[step_index],
					...data,
				}

				workspace.steps.splice(step_index, 1, newStep)

				user.workspaces.splice(index, 1, workspace)

				await this.UserRepository.userUpdate(user_id, {
					workspaces: user.workspaces,
				})
			}
		}
	}
	async workspaceStepDelete(
		step_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const index = user.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const workspace = user.workspaces[index]

			const step_index = workspace.steps.findIndex(
				(step) => step._id === step_id
			)

			if (step_index !== -1) {
				workspace.steps.splice(step_index, 1)

				user.workspaces.splice(index, 1, workspace)

				await this.UserRepository.userUpdate(user_id, {
					workspaces: user.workspaces,
				})
			}
		}
	}
}
