import { TaskRepository } from '../../../repositories/userRepository/class/Task'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { FindTaskByWorkspaceUseCase } from '../../Task/FindTaskByWorkspaceUseCase/FindTaskByWorkspaceUseCase'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { TaskMemberRepository } from './../../../repositories/userRepository/class/TaskMember'
import { CreateTaskUseCase } from './../../Task/CreateTaskUseCase/CreateTaskUseCase'
import { AddTaskMemberUseCase } from './../AddTaskMemberUseCase/AddTaskMemberUseCase'
import { DeleteTaskMemberUseCase } from './DeleteTaskMemberUseCase'

describe('Delete Member in Task', () => {
	const userRepository = new MockUserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(userRepository)
	const taskMemberRepository = new TaskMemberRepository(userRepository)

	const addTaskMemberUseCase = new AddTaskMemberUseCase(taskMemberRepository)

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const createTaskUseCase = new CreateTaskUseCase(taskRepository)

	const findTaskByWorkspaceUseCase = new FindTaskByWorkspaceUseCase(
		taskRepository
	)

	const deleteTaskMemberUseCase = new DeleteTaskMemberUseCase(
		taskMemberRepository
	)

	it('should not be able delete member_id in task without id', async () => {
		let errorMessage = ''

		try {
			await deleteTaskMemberUseCase.execute()
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do membro inválido')
	})

	it('should not be able delete member_id without task_id', async () => {
		let errorMessage = ''

		try {
			await deleteTaskMemberUseCase.execute('123', '')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID da tarefa inválida')
	})

	it('should not be able delete member_id without workspace_id', async () => {
		let errorMessage = ''

		try {
			await deleteTaskMemberUseCase.execute('123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do workspace inválido')
	})

	it('should not be able delete member_id without user_id', async () => {
		let errorMessage = ''

		try {
			await deleteTaskMemberUseCase.execute('123', '123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do usuário inválido')
	})

	it('should be able delete member_id in task', async () => {
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

		const task_id = await createTaskUseCase.execute(
			{
				title: 'Fazer café',
				step_id: '123',
			},
			workspace_id,
			user_id
		)

		await addTaskMemberUseCase.execute(
			member_id,
			task_id,
			workspace_id,
			user_id
		)

		const tasks = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			tasks[0].members_id.some((member) => member === member_id)
		).toBeTruthy()

		await deleteTaskMemberUseCase.execute(
			member_id,
			task_id,
			workspace_id,
			user_id
		)

		const tasks_updated = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		expect(
			tasks_updated[0].members_id.some((member) => member === member_id)
		).not.toBeTruthy()
	})
})
