import { TaskRepositoryContract } from '@repositories/userRepository/TaskRepository'

export class DeleteTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(task_id = '', workspace_id = '', user_id = '') {
		if (!task_id) {
			throw new Error('ID da tarefa inválida')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		await this.TaskRepository.taskDelete(task_id, workspace_id, user_id)
	}
}
