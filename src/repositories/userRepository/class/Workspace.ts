import { WorkspaceModel } from '@models/WorkspaceModel/WorkspaceModel'
import { UserRepositoryContract } from '../UserRepository'

import {
	CreateWorkspaceDTO,
	WorkspaceRepositoryContract,
} from '../WorkspaceRepository'

export class WorkspaceRepository implements WorkspaceRepositoryContract {
	constructor(private UserRepository: UserRepositoryContract) {}

	async workspaceCreate(
		data: CreateWorkspaceDTO,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		const workspace = user.addWorkspace(data as WorkspaceModel)

		await this.UserRepository.userUpdate(user_id, {
			workspaces: user.workspaces,
		})

		return workspace._id
	}
	async workspaceUpdate(
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		user.updateWorkspace(workspace_id, data)

		await this.UserRepository.userUpdate(user_id, {
			workspaces: user.workspaces,
		})
	}

	async workspaceDelete(workspace_id: string, user_id: string): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		user.deleteWorkspace(workspace_id)

		await this.UserRepository.userUpdate(user_id, {
			workspaces: user.workspaces,
		})
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

		return user.getWorkspace(workspace_id)
	}
}
