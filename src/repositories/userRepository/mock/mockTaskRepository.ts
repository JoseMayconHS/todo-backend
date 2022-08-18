import { TaskModel } from '@models/TaskModel/TaskModel'
import { WorkspaceModel } from '@models/WorkspaceModel/WorkspaceModel'
import { UserRepositoryContract } from '../UserRepository'
import { WorkspaceRepositoryContract } from '../WorkspaceRepository'

import { CreateTaskDTO, TaskRepositoryContract } from '../TaskRepository'

export class MockTaskRepository implements TaskRepositoryContract {
	private UserRepository: UserRepositoryContract

	constructor(private WorkspaceRepository: WorkspaceRepositoryContract) {
		this.UserRepository = this.WorkspaceRepository.userRepository
	}

	async taskCreate(
		data: CreateTaskDTO,
		workspace_id: string,
		user_id: string
	): Promise<string> {
		const user = await this.UserRepository.userGetByID(user_id)

		const { workspaces } = user

		const Task = new TaskModel(data)

		const workspace_index = workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const new_workspace: WorkspaceModel = {
				...workspaces[workspace_index].toObj(),
				tasks: [...workspaces[workspace_index].tasks, Task],
			}

			user.updateWorkspace(workspace_id, new_workspace)
		}

		return Task._id
	}
	async taskUpdate(
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const { workspaces } = user

		const workspace_index = workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const tasks = workspaces[workspace_index].tasks

			const task_index = tasks.findIndex((task) => task._id === task_id)

			if (task_index !== -1) {
				const task_updated = new TaskModel(
					{
						...tasks[task_index].toObj(),
						...data,
					},
					task_id
				)

				tasks.splice(task_index, 1, task_updated)

				user.updateWorkspace(workspace_id, { tasks })
			}
		}
	}
	async taskDelete(
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const { workspaces } = user

		const workspace_index = workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const new_tasks = workspaces[workspace_index].tasks.filter(
				(task) => task._id !== task_id
			)

			const new_workspace: WorkspaceModel = {
				...workspaces[workspace_index].toObj(),
				tasks: new_tasks,
			}

			user.updateWorkspace(workspace_id, new_workspace)
		}
	}
	async taskGetByWorkspace(
		workspace_id: string,
		user_id: string
	): Promise<TaskModel[]> {
		const workspace = await this.WorkspaceRepository.workspaceGetByID(
			workspace_id,
			user_id
		)

		return workspace.tasks
	}
}
