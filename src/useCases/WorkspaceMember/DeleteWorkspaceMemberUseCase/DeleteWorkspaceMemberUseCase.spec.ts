import { UserRepository } from '../../../repositories/repositories'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { WorkspaceMemberRepository } from '../../../repositories/userRepository/class/WorkspaceMember'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { AddWorkspaceMemberUseCase } from '../AddWorkspaceMemberUseCase/AddWorkspaceMemberUseCase'
import { DeleteWorkspaceMemberUseCase } from './DeleteWorkspaceMemberUseCase'

describe('Delete Member', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const workspaceMemberRepository = new WorkspaceMemberRepository(
		userRepository
	)

	const createWorkspaceMemberUseCase = new AddWorkspaceMemberUseCase(
		workspaceMemberRepository
	)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)
	const deleteWorkspaceMemberUseCase = new DeleteWorkspaceMemberUseCase(
		workspaceMemberRepository
	)

	it('should not be able delete member without id', async () => {
		let errorMessage = ''

		try {
			await deleteWorkspaceMemberUseCase.execute()
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do membro inválido')
	})

	it('should not be able delete member without workspace_id', async () => {
		let errorMessage = ''

		try {
			await deleteWorkspaceMemberUseCase.execute('123', '')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do workspace inválido')
	})

	it('should not be able delete member without user_id', async () => {
		let errorMessage = ''

		try {
			await deleteWorkspaceMemberUseCase.execute('123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do usuário inválido')
	})

	it('should be able delete member', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const member_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
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

		await createWorkspaceMemberUseCase.execute(member_id, workspace_id, user_id)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			workspace.members_id.some((member) => member === member_id)
		).toBeTruthy()

		await deleteWorkspaceMemberUseCase.execute(member_id, workspace_id, user_id)

		const workspace_updated = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			workspace_updated.members_id.some((member) => member === member_id)
		).not.toBeTruthy()
	})
})
