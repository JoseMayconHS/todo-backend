import { WorkspaceStepRepositoryContract } from '@repositories/userRepository/WorkspaceStepRepository'

export class DeleteWorkspaceStepUseCase {
	constructor(
		private WorkspaceStepRepository: WorkspaceStepRepositoryContract
	) {}

	async execute(step_id = '', workspace_id = '', user_id = '') {
		if (!step_id) {
			throw new Error('ID do estágio inválido')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		await this.WorkspaceStepRepository.workspaceStepDelete(
			step_id,
			workspace_id,
			user_id
		)
	}
}
