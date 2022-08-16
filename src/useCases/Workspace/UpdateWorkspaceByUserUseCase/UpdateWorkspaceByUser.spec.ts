import {
	UserRepository,
	WorkspaceRepository,
} from '../../../repositories/repositories'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByUserUseCase } from '../FindWorkspaceByUserUseCase/FindWorkspaceByUserUseCase'
import { UpdateWorkspaceByUser } from './UpdateWorkspaceByUser'

describe('Update Workspace by user', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)

	const updateWorkspaceByUser = new UpdateWorkspaceByUser(workspaceRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByUserUseCase = new FindWorkspaceByUserUseCase(
		workspaceRepository
	)
	const createUserUseCase = new CreateUserUseCase(userRepository)

	it('should not be able update workspace without data to update', async () => {
		await expect(
			updateWorkspaceByUser.execute('123', '331', {})
		).rejects.toThrow()
	})

	it('should not be able update workspace without workspace_id', async () => {
		await expect(
			updateWorkspaceByUser.execute('', '123', { title: 'Novo titulo' })
		).rejects.toThrow()
	})

	it('should not be able update workspace without user_id', async () => {
		await expect(
			updateWorkspaceByUser.execute('123', '', { title: 'Novo titulo' })
		).rejects.toThrow()
	})
	it('should be able update workspace', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const workspace_title = 'Pessoal'

		const workspace_id = await createWorkspaceUseCase.execute(
			{
				title: workspace_title,
				description: 'Workspace para meu dia-a-dia',
			},
			user_id
		)

		const new_workspace_title = 'Novo titulo do workspace'

		await updateWorkspaceByUser.execute(workspace_id, user_id, {
			title: new_workspace_title,
		})

		const workspaces = await findWorkspaceByUserUseCase.execute(user_id)

		expect(workspaces).toHaveLength(1)
		expect(workspaces[0].title).toBe(new_workspace_title)
	})
})
