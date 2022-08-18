import { WorkspaceModel } from '../../../models/WorkspaceModel/WorkspaceModel'
import { UserRepository } from '../../../repositories/repositories'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { FindWorkspaceByUserUseCase } from '../FindWorkspaceByUserUseCase/FindWorkspaceByUserUseCase'
import { CreateWorkspaceByUserUseCase } from './CreateWorkspaceByUserUseCase'

describe('Create Workspace', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const findWorkspaceByUserUseCase = new FindWorkspaceByUserUseCase(
		workspaceRepository
	)
	const createWorkspaceByUserUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)

	it('should not be able create a workspace without title', async () => {
		const data = {
			title: '',
		}

		await expect(
			createWorkspaceByUserUseCase.execute(data, '123')
		).rejects.toThrow()
	})

	it('should not be able create a workspace without user_id', async () => {
		const data = {
			title: 'Title',
		}

		await expect(createWorkspaceByUserUseCase.execute(data)).rejects.toThrow()
	})

	it('should be able create a workspace', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await createWorkspaceByUserUseCase.execute(
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
