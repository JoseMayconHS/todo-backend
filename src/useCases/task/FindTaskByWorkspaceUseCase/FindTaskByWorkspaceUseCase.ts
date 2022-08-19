import { TaskModel } from '@models/TaskModel/TaskModel'
import { TaskRepositoryContract } from '@repositories/userRepository/TaskRepository'

export class FindTaskByWorkspaceUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(workspace_id = '', user_id = ''): Promise<TaskModel[]> {
		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const tasks = await this.TaskRepository.taskGetByWorkspace(
			workspace_id,
			user_id
		)

		return tasks
	}
}
