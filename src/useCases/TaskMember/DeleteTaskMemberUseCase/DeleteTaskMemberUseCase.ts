import { TaskMemberRepositoryContract } from '@repositories/userRepository/TaskMemberRepository'

export class DeleteTaskMemberUseCase {
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

		await this.TaskMemberRepository.deleteTaskMember(
			member_id,
			task_id,
			workspace_id,
			user_id
		)
	}
}
