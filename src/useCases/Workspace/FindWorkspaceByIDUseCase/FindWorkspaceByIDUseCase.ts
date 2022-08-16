import { WorkspaceRepositoryContract } from '@repositories/userRepository/WorkspaceRepository'

export class FindWorkspaceByIDUseCase {
	constructor(private WorkspaceRepository: WorkspaceRepositoryContract) {}

	async execute(workspace_id = '', user_id = '') {
		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const workspace = await this.WorkspaceRepository.workspaceGetByID(
			workspace_id,
			user_id
		)

		return workspace
	}
}
