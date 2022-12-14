import { CreateTaskUseCase } from '../CreateTaskUseCase/CreateTaskUseCase'

import { TaskModel } from '../../../models/TaskModel/TaskModel'
import { TaskRepository } from '../../../repositories/userRepository/class/Task'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindTaskByWorkspaceUseCase } from './FindTaskByWorkspaceUseCase'

describe('Find Tasks by workspace', () => {
	const userRepository = new MockUserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(userRepository)

	const findTaskByWorkspaceUseCase = new FindTaskByWorkspaceUseCase(
		taskRepository
	)
	const createTaskUseCase = new CreateTaskUseCase(taskRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceByUserUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)

	it('should not be able find tasks without workspace_id', async () => {
		await expect(findTaskByWorkspaceUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able find tasks without user_id', async () => {
		await expect(findTaskByWorkspaceUseCase.execute('123')).rejects.toThrow()
	})

	it('should be able find tasks by workspace_id', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const workspace_id = await createWorkspaceByUserUseCase.execute(
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

		const tasks = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		expect(tasks).toHaveLength(1)
		expect(tasks[0]).toBeInstanceOf(TaskModel)
	})
})
