import { CreateStepDTO } from '@models/WorkspaceModel/WorkspaceModel'
import { WorkspaceStepRepositoryContract } from './../../../repositories/userRepository/WorkspaceStepRepository'

export class CreateWorkspaceStepUseCase {
	constructor(
		private WorkspaceStepRepository: WorkspaceStepRepositoryContract
	) {}

	async execute(data = {} as CreateStepDTO, workspace_id = '', user_id = '') {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		if (!data.label) {
			throw new Error('Label inválido')
		}

		if (!workspace_id) {
			throw new Error('ID do workspace inválido')
		}

		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const _id = await this.WorkspaceStepRepository.workspaceStepCreate(
			data,
			workspace_id,
			user_id
		)

		return _id
	}
}
