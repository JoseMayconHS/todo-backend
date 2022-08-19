import {
	CreateTaskChecklistDTO,
	TaskChecklistRepositoryContract,
} from '@repositories/userRepository/TaskChecklistRepository'

export class AddTaskChecklistUseCase {
	constructor(
		private TaskChecklistRepository: TaskChecklistRepositoryContract
	) {}

	async execute(
		data = {} as CreateTaskChecklistDTO,
		task_id = '',
		workspace_id = '',
		user_id = ''
	): Promise<string> {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para criar checklist')
		}

		if (!task_id) {
			throw new Error('ID da tarefa inválida')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const _id = await this.TaskChecklistRepository.taskChecklistCreate(
			data,
			task_id,
			workspace_id,
			user_id
		)

		return _id
	}
}
