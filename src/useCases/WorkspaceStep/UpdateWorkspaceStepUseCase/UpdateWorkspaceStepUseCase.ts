import { WorkspaceStepRepositoryContract } from '@repositories/userRepository/WorkspaceStepRepository'

export class UpdateWorkspaceStepUseCase {
	constructor(
		private WorkspaceStepRepository: WorkspaceStepRepositoryContract
	) {}

	async execute(step_id = '', workspace_id = '', user_id = '', data = {}) {
		if (!step_id) {
			throw new Error('ID do estágio inválido')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		await this.WorkspaceStepRepository.workspaceStepUpdate(
			step_id,
			workspace_id,
			user_id,
			data
		)
	}
}
