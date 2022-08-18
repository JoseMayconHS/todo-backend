import { UserRepository } from '../../../repositories/repositories'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { WorkspaceStepRepository } from '../../../repositories/userRepository/class/WorkspaceStep'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { CreateWorkspaceStepUseCase } from './../CreateWorkspaceStepUseCase/CreateWorkspaceStepUseCase'
import { DeleteWorkspaceStepUseCase } from './DeleteWorkspaceStepUseCase'

describe('Delete Step', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const workspaceStepRepository = new WorkspaceStepRepository(userRepository)

	const createWorkspaceStepUseCase = new CreateWorkspaceStepUseCase(
		workspaceStepRepository
	)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)
	const deleteWorkspaceStepUseCase = new DeleteWorkspaceStepUseCase(
		workspaceStepRepository
	)

	it('should not be able delete step without id', async () => {
		await expect(deleteWorkspaceStepUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able delete step without workspace_id', async () => {
		await expect(deleteWorkspaceStepUseCase.execute('123')).rejects.toThrow()
	})

	it('should not be able delete step without user_id', async () => {
		await expect(
			deleteWorkspaceStepUseCase.execute('123', '123')
		).rejects.toThrow()
	})

	it('should be able delete step', async () => {
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

		const step_id = await createWorkspaceStepUseCase.execute(
			{
				label: 'Revisar',
			},
			workspace_id,
			user_id
		)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(workspace.steps.some((step) => step._id === step_id)).toBeTruthy()

		await deleteWorkspaceStepUseCase.execute(step_id, workspace_id, user_id)

		const workspace_updated = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			workspace_updated.steps.some((step) => step._id === step_id)
		).not.toBeTruthy()
	})
})
