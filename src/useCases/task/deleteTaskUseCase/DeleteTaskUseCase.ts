import { TaskRepositoryContract } from '@repositories/taskRepository/TaskRepository'

export class DeleteTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(id: string) {
		if (!id) {
			throw new Error('ID inválido')
		}

		await this.TaskRepository.delete(id)
	}
}
