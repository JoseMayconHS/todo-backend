import { WorkspaceMemberRepositoryContract } from '@repositories/userRepository/WorkspaceMemberRepository'

export class DeleteWorkspaceMemberUseCase {
	constructor(
		private WorkspaceMemberRepository: WorkspaceMemberRepositoryContract
	) {}

	async execute(member_id = '', workspace_id = '', user_id = '') {
		if (!member_id) {
			throw new Error('ID do membro inválido')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		await this.WorkspaceMemberRepository.deleteWorkspaceMember(
			member_id,
			workspace_id,
			user_id
		)
	}
}
