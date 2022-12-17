import { TaskRepository } from '../../../repositories/userRepository/class/Task'
import { TaskChecklistRepository } from '../../../repositories/userRepository/class/TaskChecklist'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateTaskUseCase } from '../../Task/CreateTaskUseCase/CreateTaskUseCase'
import { FindTaskByWorkspaceUseCase } from '../../Task/FindTaskByWorkspaceUseCase/FindTaskByWorkspaceUseCase'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { AddTaskChecklistUseCase } from './../AddTaskChecklistUseCase/AddTaskChecklistUseCase'
import { UpdateTaskChecklistUseCase } from './UpdateTaskChecklistUseCase'

describe('update item in Checklist in Task', () => {
	const userRepository = new MockUserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(userRepository)
	const taskChecklistRepository = new TaskChecklistRepository(userRepository)

	const addTaskChecklistUseCase = new AddTaskChecklistUseCase(
		taskChecklistRepository
	)
	const updateTaskChecklistUseCase = new UpdateTaskChecklistUseCase(
		taskChecklistRepository
	)

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const createWorkspaceUseCase = new CreateWorkspaceByUserUseCase(
		workspaceRepository
	)
	const createTaskUseCase = new CreateTaskUseCase(taskRepository)
	const findTaskByWorkspaceUseCase = new FindTaskByWorkspaceUseCase(
		taskRepository
	)

	const generic = {
		description: 'Se aquecer',
	}

	it('should not be able update item in checklist without user_id', async () => {
		let errorMessage = ''

		try {
			await updateTaskChecklistUseCase.execute(generic, '123', '123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do usuário inválido')
	})

	it('should not be able update item in checklist without workspace_id', async () => {
		let errorMessage = ''

		try {
			await updateTaskChecklistUseCase.execute(generic, '123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do workspace inválido')
	})

	it('should not be able update item in checklist without task_id', async () => {
		let errorMessage = ''

		try {
			await updateTaskChecklistUseCase.execute(generic, '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID da tarefa inválida')
	})

	it('should not be able update item in checklist without checkitem_id', async () => {
		let errorMessage = ''

		try {
			await updateTaskChecklistUseCase.execute(generic)
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do item da checklist inválido')
	})

	it('should not be able update item in checklist without data', async () => {
		let errorMessage = ''

		try {
			await updateTaskChecklistUseCase.execute()
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('Nenhuma informação para criar checklist')
	})

	it('should be able update item in checklist', async () => {
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
				step_id: '123',
			},
			workspace_id,
			user_id
		)

		const description = 'Se exercitar'

		const checkitem_id = await addTaskChecklistUseCase.execute(
			{
				description,
			},
			task_id,
			workspace_id,
			user_id
		)

		let tasks = await findTaskByWorkspaceUseCase.execute(workspace_id, user_id)

		let checkitem = tasks[0].checklist.find(
			(checkitem) => checkitem._id === checkitem_id
		)

		expect(checkitem.description).toBe(description)

		const new_description = 'Se aquecer'

		await updateTaskChecklistUseCase.execute(
			{
				description: new_description,
			},
			checkitem_id,
			task_id,
			workspace_id,
			user_id
		)

		tasks = await findTaskByWorkspaceUseCase.execute(workspace_id, user_id)

		checkitem = tasks[0].checklist.find(
			(checkitem) => checkitem._id === checkitem_id
		)

		expect(checkitem.description).toBe(new_description)
	})
})
