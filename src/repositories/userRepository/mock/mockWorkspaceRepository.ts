import { WorkspaceModel } from '@models/WorkspaceModel'
import { UserRepositoryContract } from '../UserRepository'

import {
	CreateWorkspaceDTO,
	WorkspaceRepositoryContract,
} from '../WorkspaceRepository'

export class MockWorkspaceRepository implements WorkspaceRepositoryContract {
	constructor(private UserRepository: UserRepositoryContract) {}

	get userRepository() {
		return this.UserRepository
	}

	async workspaceCreate(
		data: CreateWorkspaceDTO,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		const workspace = new WorkspaceModel(data)

		user.addWorkspace(workspace)

		return workspace._id
	}
	async workspaceUpdate(
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const index = user.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const newWorkspace = new WorkspaceModel(
				{
					...user.workspaces[index],
					...data,
				},
				workspace_id
			)

			user.workspaces.splice(index, 1, newWorkspace)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
	async workspaceDelete(workspace_id: string, user_id: string): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const index = user.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			user.workspaces.splice(index, 1)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
	async workspaceGetByUser(user_id: string): Promise<WorkspaceModel[]> {
		const user = await this.UserRepository.userGetByID(user_id)

		return user.workspaces
	}
	async workspaceGetByID(
		workspace_id: string,
		user_id: string
	): Promise<WorkspaceModel> {
		const user = await this.UserRepository.userGetByID(user_id)

		const workspace = user.workspaces.find(
			(workspace) => workspace._id === workspace_id
		)

		return workspace
	}
}
