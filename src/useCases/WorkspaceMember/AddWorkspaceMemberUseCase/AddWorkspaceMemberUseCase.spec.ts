import {
	UserRepository,
	WorkspaceMemberRepository,
	WorkspaceRepository,
} from '../../../repositories/repositories'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { AddWorkspaceMemberUseCase } from './AddWorkspaceMemberUseCase'

describe('Create Member', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const workspaceMemberRepository = new WorkspaceMemberRepository(
		userRepository
	)

	const addWorkspaceMemberUseCase = new AddWorkspaceMemberUseCase(
		workspaceMemberRepository
	)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)

	it('should not be able add member_id without workspace_id', async () => {
		let errorMessage = ''

		try {
			await addWorkspaceMemberUseCase.execute('123', '')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do workspace inválido')
	})

	it('should not be able add member_id without user_id', async () => {
		let errorMessage = ''

		try {
			await addWorkspaceMemberUseCase.execute('123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do usuário inválido')
	})

	it('should not be able add member_id without member_id', async () => {
		let errorMessage = ''

		try {
			await addWorkspaceMemberUseCase.execute()
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do membro inválido')
	})

	it('should be able add member_id', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const member_id = await createUserUseCase.execute({
			name: 'Maycon Silva2',
			password: '123456',
			email: 'a2@g.com',
		})

		const workspace_id = await createWorkspaceUseCase.execute(
			{
				title: 'Pessoal',
				description: 'Workspace para meu dia-a-dia',
			},
			user_id
		)

		await addWorkspaceMemberUseCase.execute(member_id, workspace_id, user_id)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			workspace.members_id.some((member) => member === member_id)
		).toBeTruthy()
	})
})
