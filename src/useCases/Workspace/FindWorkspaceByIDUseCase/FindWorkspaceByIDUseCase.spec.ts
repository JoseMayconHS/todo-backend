import {
	UserRepository,
	WorkspaceRepository,
} from '../../../repositories/repositories'
import { CreateWorkspaceByUserUseCase } from '../CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'

import { WorkspaceModel } from '../../../models/WorkspaceModel/WorkspaceModel'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { FindWorkspaceByIDUseCase } from './FindWorkspaceByIDUseCase'

describe('Find Workspaces by User', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)

	it('should not be able find workspace without workspace_id', async () => {
		await expect(findWorkspaceByIDUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able find workspace without user_id', async () => {
		await expect(findWorkspaceByIDUseCase.execute('1234', '')).rejects.toThrow()
	})

	it('should be able find workspace by ID', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const workspace_id = await createWorkspaceUseCase.execute(
			{
				title: 'Pessoal',
				description: 'Workspace para meu dia-a-dia',
			},
			user_id
		)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(workspace).toBeInstanceOf(WorkspaceModel)
	})
})
