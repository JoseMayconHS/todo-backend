import {
	CreateTaskDTO,
	TaskRepositoryContract,
} from '@repositories/taskRepository/TaskRepository'

export class CreateTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(data: CreateTaskDTO) {
		if (!data.title.length) {
			throw new Error('Título inválido')
		}

		if (!data.step_id) {
			throw new Error('Nenhum estágio associado a tarefa')
		}

		const _id = await this.TaskRepository.create(data)

		return _id
	}
}
