import {
	UserRepository,
	WorkspaceRepository,
} from './../../../repositories/repositories'

import { CreateUserUseCase } from './../../User/CreateUserUseCase/CreateUserUseCase'
import { FindWorkspaceByUserUseCase } from './FindWorkspaceByUserUseCase'

describe('Find Workspaces by User', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const createUserUseCase = new CreateUserUseCase(userRepository)
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

		const workspaces = await findWorkspaceByUserUseCase.execute(user_id)

		expect(workspaces).toHaveLength(0)
	})
})
