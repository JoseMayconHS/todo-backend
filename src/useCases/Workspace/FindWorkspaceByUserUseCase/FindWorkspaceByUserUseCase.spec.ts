import { WorkspaceModel } from '../../../models/WorkspaceModel/WorkspaceModel'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'

import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByUserUseCase } from './FindWorkspaceByUserUseCase'

describe('Find Workspaces by User', () => {
	const userRepository = new MockUserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByUserUseCase = new FindWorkspaceByUserUseCase(
		workspaceRepository
	)

	it('should not be able find workspaces without user_id', async () => {
		await expect(findWorkspaceByUserUseCase.execute('')).rejects.toThrow()
	})

	it('should be able find workspaces by user_id', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await createWorkspaceUseCase.execute(
			{
				title: 'Pessoal',
				description: 'Workspace para meu dia-a-dia',
			},
			user_id
		)

		const workspaces = await findWorkspaceByUserUseCase.execute(user_id)

		expect(workspaces).toHaveLength(1)
		expect(workspaces[0]).toBeInstanceOf(WorkspaceModel)
	})
})
