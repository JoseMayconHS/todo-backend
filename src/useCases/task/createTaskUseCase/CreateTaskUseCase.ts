import {
	CreateTaskDTO,
	TaskRepositoryContract,
} from '@repositories/userRepository/TaskRepository'

export class CreateTaskUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(data = {} as CreateTaskDTO, workspace_id = '', user_id = '') {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		if (!data.title) {
			throw new Error('Título inválido')
		}

		if (!data.step_id) {
			throw new Error('Nenhum estágio associado a tarefa')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const _id = await this.TaskRepository.taskCreate(
			data,
			workspace_id,
			user_id
		)

		return _id
	}
}
