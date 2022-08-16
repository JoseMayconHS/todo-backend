import { TaskRepository } from '../../../repositories/repositories'

import {
	UserRepository,
	WorkspaceRepository,
} from '../../../repositories/repositories'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { CreateTaskUseCase } from './CreateTaskUseCase'

describe('Create Task', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(workspaceRepository)

	const createTaskUseCase = new CreateTaskUseCase(taskRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)

	const generic = {
		title: 'Fazer café',
		step_id: '13123',
	}

	it('should not be able create task without workspace_id', async () => {
		await expect(createTaskUseCase.execute(generic, '')).rejects.toThrow()
	})

	it('should not be able create task without user_id', async () => {
		await expect(createTaskUseCase.execute(generic, '123')).rejects.toThrow()
	})

	it('should not be able create task without data to update', async () => {
		await expect(createTaskUseCase.execute()).rejects.toThrow()
	})
	it('should not be able create task without title', async () => {
		const data = {
			title: '',
			step_id: '',
		}
		await expect(createTaskUseCase.execute(data)).rejects.toThrow()
	})

	it('should not be able create task without step_id', async () => {
		const data = {
			title: 'Title',
			step_id: '',
		}
		await expect(createTaskUseCase.execute(data)).rejects.toThrow()
	})

	it('should be able create task', async () => {
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

		await createTaskUseCase.execute(
			{
				title: 'Fazer café',
				step_id: '12',
			},
			workspace_id,
			user_id
		)

		const workspace = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(workspace.tasks).toHaveLength(1)
	})
})
