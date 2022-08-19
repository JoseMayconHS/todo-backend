import {
	CreateWorkspaceDTO,
	WorkspaceRepositoryContract,
} from '@repositories/userRepository/WorkspaceRepository'

export class CreateWorkspaceByUserUseCase {
	constructor(private WorkspaceRepository: WorkspaceRepositoryContract) {}

	async execute(
		data = {} as CreateWorkspaceDTO,
		user_id = ''
	): Promise<string> {
		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		if (!data.title) {
			throw new Error('Título inválido')
		}

		const _id = await this.WorkspaceRepository.workspaceCreate(data, user_id)

		return _id
	}
}
