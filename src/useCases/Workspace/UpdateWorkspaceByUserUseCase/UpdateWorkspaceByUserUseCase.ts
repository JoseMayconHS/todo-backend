import { WorkspaceRepositoryContract } from '@repositories/userRepository/WorkspaceRepository'

export class UpdateWorkspaceByUserUseCase {
	constructor(private WorkspaceRepository: WorkspaceRepositoryContract) {}

	async execute(workspace_id = '', user_id = '', data = {}) {
		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		await this.WorkspaceRepository.workspaceUpdate(workspace_id, user_id, data)
	}
}
