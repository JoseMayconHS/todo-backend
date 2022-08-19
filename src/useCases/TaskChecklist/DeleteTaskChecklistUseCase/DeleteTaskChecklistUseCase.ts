import { TaskChecklistRepositoryContract } from '@repositories/userRepository/TaskChecklistRepository'

export class DeleteTaskChecklistUseCase {
	constructor(
		private TaskChecklistRepository: TaskChecklistRepositoryContract
	) {}

	async execute(
		checkitem_id = '',
		task_id = '',
		workspace_id = '',
		user_id = ''
	) {
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

		await this.TaskChecklistRepository.taskChecklistDelete(
			checkitem_id,
			task_id,
			workspace_id,
			user_id
		)
	}
}
