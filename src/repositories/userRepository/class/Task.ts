import { TaskModel } from '@models/TaskModel/TaskModel'
import { UserRepositoryContract } from '../UserRepository'

import { CreateTaskDTO, TaskRepositoryContract } from '../TaskRepository'

export class TaskRepository implements TaskRepositoryContract {
	constructor(private UserRepository: UserRepositoryContract) {}

	async taskCreate(
		data: CreateTaskDTO,
		workspace_id: string,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			const task = user.addTask(workspace_id, data)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})

			return task._id
		}
	}

	async taskUpdate(
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.updateTask(task_id, workspace_id, data)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}

	async taskDelete(
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.deleteTask(task_id, workspace_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
	async taskGetByWorkspace(
		workspace_id: string,
		user_id: string
	): Promise<TaskModel[]> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			const workspace = user.getWorkspace(workspace_id)

			return workspace.tasks
		}
	}
}
