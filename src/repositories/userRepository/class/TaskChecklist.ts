import {
	CreateTaskChecklistDTO,
	TaskChecklistRepositoryContract,
} from '../TaskChecklistRepository'
import { UserRepositoryContract } from '../UserRepository'

export class TaskChecklistRepository
	implements TaskChecklistRepositoryContract
{
	constructor(private UserRepository: UserRepositoryContract) {}

	async taskChecklistCreate(
		data: CreateTaskChecklistDTO,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			const checkitem = user.addChecklistItemInTask(task_id, workspace_id, data)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})

			return checkitem._id
		}
	}

	async taskChecklistDelete(
		checkitem_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.deleteChecklistItemInTask(checkitem_id, task_id, workspace_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}

	async taskChecklistUpdate(
		checkitem_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Partial<CreateTaskChecklistDTO>
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.updateChecklistItemInTask(checkitem_id, task_id, workspace_id, data)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
}
