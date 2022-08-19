import {
	CreateTaskChecklistDTO,
	TaskChecklistRepositoryContract,
} from '@repositories/userRepository/TaskChecklistRepository'

export class UpdateTaskChecklistUseCase {
	constructor(
		private TaskChecklistRepository: TaskChecklistRepositoryContract
	) {}

	async execute(
		data = {} as CreateTaskChecklistDTO,
		checkitem_id = '',
		task_id = '',
		workspace_id = '',
		user_id = ''
	) {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para criar checklist')
		}

		if (!checkitem_id) {
			throw new Error('ID do item da checklist inválido')
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

		await this.TaskChecklistRepository.taskChecklistUpdate(
			checkitem_id,
			task_id,
			workspace_id,
			user_id,
			data
		)
	}
}
