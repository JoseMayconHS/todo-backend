import { UserRepository } from '../../../repositories/repositories'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { FindUserByIDUseCase } from '../../User/FindUserByIDUseCase/FindUserByIDUseCase'
import { CreateWorkspaceByUserUseCase } from '../CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { DeleteWorkspaceByUserUseCase } from './DeleteWorkspaceByUserUseCase'

describe('Delete Workspace by user', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const deleteWorkspaceByUserUseCase = new DeleteWorkspaceByUserUseCase(
		workspaceRepository
	)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)

	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	it('should not be able delete workspace without workspace_id', async () => {
		await expect(deleteWorkspaceByUserUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able delete workspace without user_id', async () => {
		await expect(
			deleteWorkspaceByUserUseCase.execute('123', '')
		).rejects.toThrow()
	})

	it('should be able delete workspace', async () => {
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

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user.workspaces).toHaveLength(1)

		await deleteWorkspaceByUserUseCase.execute(workspace_id, user_id)

		const userAfterWorkspaceDeleted = await findUserByIDUseCase.execute(user_id)

		expect(userAfterWorkspaceDeleted.workspaces).toHaveLength(0)
	})
})
