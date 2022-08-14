import {
	TaskRepository,
	UserRepository,
	WorkspaceRepository,
} from '../../../repositories/repositories'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { CreateTaskUseCase } from '../CreateTaskUseCase/CreateTaskUseCase'
import { FindTaskByWorkspaceUseCase } from './../FindTaskByWorkspaceUseCase/FindTaskByWorkspaceUseCase'
import { UpdateTaskUseCase } from './UpdateTaskUseCase'

describe('Update Task', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(workspaceRepository)

	const updateTaskUseCase = new UpdateTaskUseCase(taskRepository)
	const createTaskUseCase = new CreateTaskUseCase(taskRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findTaskByWorkspaceUseCase = new FindTaskByWorkspaceUseCase(
		taskRepository
	)

	it('should not be able update task without id', async () => {
		await expect(updateTaskUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able update task without workspace_id', async () => {
		await expect(updateTaskUseCase.execute('123')).rejects.toThrow()
	})

	it('should not be able update task without user_id', async () => {
		await expect(updateTaskUseCase.execute('123', '123')).rejects.toThrow()
	})

	it('should not be able update task without data to update', async () => {
		await expect(
			updateTaskUseCase.execute('123', '123', '123')
		).rejects.toThrow()
	})

	it('should not be able update task without id', async () => {
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

		const task_title = 'Fazer café'

		const task_id = await createTaskUseCase.execute(
			{
				title: task_title,
				step_id: '12',
			},
			workspace_id,
			user_id
		)

		const tasks = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		expect(tasks[0].title).toBe(task_title)

		const new_title = 'Fazer achocolatado'

		await updateTaskUseCase.execute(task_id, workspace_id, user_id, {
			title: new_title,
		})

		const tasks_updated = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		expect(tasks_updated[0].title).toBe(new_title)
	})
})
