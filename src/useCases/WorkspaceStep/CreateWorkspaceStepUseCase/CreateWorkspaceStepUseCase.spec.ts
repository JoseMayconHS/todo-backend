import { CreateStepDTO } from './../../../models/WorkspaceModel/WorkspaceModel'
import { CreateWorkspaceStepUseCase } from './CreateWorkspaceStepUseCase'

import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { WorkspaceStepRepository } from '../../../repositories/userRepository/class/WorkspaceStep'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'

describe('Create Step', () => {
	const userRepository = new MockUserRepository()
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

	const generic: CreateStepDTO = {
		label: 'Revisar',
		index: -1,
	}

	it('should not be able create step without workspace_id', async () => {
		await expect(
			createWorkspaceStepUseCase.execute(generic, '')
		).rejects.toThrow()
	})

	it('should not be able create step without user_id', async () => {
		await expect(
			createWorkspaceStepUseCase.execute(generic, '123')
		).rejects.toThrow()
	})

	it('should not be able create step without data to update', async () => {
		await expect(createWorkspaceStepUseCase.execute()).rejects.toThrow()
	})
	it('should not be able create step without label', async () => {
		const data = {
			label: '',
		}
		await expect(createWorkspaceStepUseCase.execute(data)).rejects.toThrow()
	})

	it('should be able create step', async () => {
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
	})
})
