import { TaskRepositoryContract } from '@repositories/userRepository/TaskRepository'

export class UpdateTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(task_id = '', workspace_id = '', user_id = '', data = {}) {
		if (!task_id) {
			throw new Error('ID da tarefa inválida')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		await this.TaskRepository.taskUpdate(task_id, workspace_id, user_id, data)
	}
}
