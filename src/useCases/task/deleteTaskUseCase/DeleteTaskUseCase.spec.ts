import { TaskRepository } from '../../../repositories/userRepository/class/Task'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { FindWorkspaceByIDUseCase } from '../../Workspace/FindWorkspaceByIDUseCase/FindWorkspaceByIDUseCase'
import { CreateTaskUseCase } from '../CreateTaskUseCase/CreateTaskUseCase'
import { DeleteTaskUseCase } from './DeleteTaskUseCase'

describe('Delete Task', () => {
	const userRepository = new MockUserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(userRepository)

	const createTaskUseCase = new CreateTaskUseCase(taskRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const findWorkspaceByIDUseCase = new FindWorkspaceByIDUseCase(
		workspaceRepository
	)
	const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository)

	it('should not be able delete task without id', async () => {
		await expect(deleteTaskUseCase.execute('')).rejects.toThrow()
	})

	it('should not be able delete task without workspace_id', async () => {
		await expect(deleteTaskUseCase.execute('123')).rejects.toThrow()
	})

	it('should not be able delete task without user_id', async () => {
		await expect(deleteTaskUseCase.execute('123', '123')).rejects.toThrow()
	})

	it('should be able delete task', async () => {
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

		const task_id = await createTaskUseCase.execute(
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

		await deleteTaskUseCase.execute(task_id, workspace_id, user_id)

		const workspace_updated = await findWorkspaceByIDUseCase.execute(
			workspace_id,
			user_id
		)

		expect(workspace_updated.tasks).toHaveLength(0)
	})
})
