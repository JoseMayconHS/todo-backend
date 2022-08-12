import { TaskRepositoryContract } from '../../../repositories/taskRepository/TaskRepository'

export class UpdateTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(id: string, data: Object) {
		if (!id) {
			throw new Error('ID inválido')
		}

		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		await this.TaskRepository.update(id, data)
	}
}
