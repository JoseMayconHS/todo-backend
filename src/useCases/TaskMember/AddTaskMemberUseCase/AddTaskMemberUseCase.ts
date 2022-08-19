import { TaskMemberRepositoryContract } from '@repositories/userRepository/TaskMemberRepository'

export class AddTaskMemberUseCase {
	constructor(private TaskMemberRepository: TaskMemberRepositoryContract) {}

	async execute(member_id = '', task_id = '', workspace_id = '', user_id = '') {
		if (!member_id) {
			throw new Error('ID do membro inválido')
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

		await this.TaskMemberRepository.addTaskMember(
			member_id,
			task_id,
			workspace_id,
			user_id
		)
	}
}
