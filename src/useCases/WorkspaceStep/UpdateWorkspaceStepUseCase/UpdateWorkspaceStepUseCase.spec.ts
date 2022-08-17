import {
	UserRepository,
	WorkspaceRepository,
	WorkspaceStepRepository,
} from '../../../repositories/repositories'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { CreateWorkspaceStepUseCase } from '../CreateWorkspaceStepUseCase/CreateWorkspaceStepUseCase'
import { UpdateWorkspaceStepUseCase } from './UpdateWorkspaceStepUseCase'

describe('Update Step', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const workspaceStepRepository = new WorkspaceStepRepository(userRepository)

	const updateWorkspaceStepUseCase = new UpdateWorkspaceStepUseCase(
		workspaceStepRepository
	)
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

	it('should not be able update step without id', async () => {
		await expect(updateWorkspaceStepUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able update step without workspace_id', async () => {
		await expect(updateWorkspaceStepUseCase.execute('123')).rejects.toThrow()
	})

	it('should not be able update step without user_id', async () => {
		await expect(
			updateWorkspaceStepUseCase.execute('123', '123')
		).rejects.toThrow()
	})

	it('should not be able update step without data to update', async () => {
		await expect(
			updateWorkspaceStepUseCase.execute('123', '123', '123')
		).rejects.toThrow()
	})

	it('should be able update step', async () => {
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

		const step_label = 'Revisar'

		const step_id = await createWorkspaceStepUseCase.execute(
			{
				label: step_label,
			},
			workspace_id,
			user_id
		)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		const step = workspace.steps.find((step) => step._id === step_id)

		expect(step.label).toBe(step_label)

		const new_label = 'Analisar'

		await updateWorkspaceStepUseCase.execute(step_id, workspace_id, user_id, {
			label: new_label,
		})

		const workspace_updated = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		const step_updated = workspace_updated.steps.find(
			(step) => step._id === step_id
		)

		expect(step_updated.label).toBe(new_label)
	})
})
