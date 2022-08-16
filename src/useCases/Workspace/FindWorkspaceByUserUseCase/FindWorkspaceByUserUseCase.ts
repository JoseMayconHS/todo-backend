import { WorkspaceRepositoryContract } from '@repositories/userRepository/WorkspaceRepository'

export class FindWorkspaceByUserUseCase {
	constructor(private WorkspaceRepository: WorkspaceRepositoryContract) {}

	async execute(user_id = '') {
		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const workspaces = await this.WorkspaceRepository.workspaceGetByUser(
			user_id
		)

		return workspaces
	}
}
