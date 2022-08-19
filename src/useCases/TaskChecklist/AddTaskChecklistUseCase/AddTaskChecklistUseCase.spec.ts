import { UserRepository } from '../../../repositories/repositories'
import { TaskRepository } from '../../../repositories/userRepository/class/Task'
import { WorkspaceRepository } from '../../../repositories/userRepository/class/Workspace'
import { CreateTaskUseCase } from '../../Task/CreateTaskUseCase/CreateTaskUseCase'
import { FindTaskByWorkspaceUseCase } from '../../Task/FindTaskByWorkspaceUseCase/FindTaskByWorkspaceUseCase'
import { CreateUserUseCase } from '../../User/CreateUserUseCase/CreateUserUseCase'
import { CreateWorkspaceByUserUseCase } from '../../Workspace/CreateWorkspaceByUserUseCase/CreateWorkspaceByUserUseCase'
import { TaskChecklistRepository } from './../../../repositories/userRepository/class/TaskChecklist'
import { AddTaskChecklistUseCase } from './AddTaskChecklistUseCase'

describe('Create item in Checklist in Task', () => {
	const userRepository = new UserRepository()
	const workspaceRepository = new WorkspaceRepository(userRepository)
	const taskRepository = new TaskRepository(userRepository)
	const taskChecklistRepository = new TaskChecklistRepository(userRepository)

	const addTaskChecklistUseCase = new AddTaskChecklistUseCase(
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

	it('should not be able add item in checklist without user_id', async () => {
		let errorMessage = ''

		try {
			await addTaskChecklistUseCase.execute(generic, '123', '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do usuário inválido')
	})

	it('should not be able add item in checklist without workspace_id', async () => {
		let errorMessage = ''

		try {
			await addTaskChecklistUseCase.execute(generic, '123')
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID do workspace inválido')
	})

	it('should not be able add item in checklist without task_id', async () => {
		let errorMessage = ''

		try {
			await addTaskChecklistUseCase.execute(generic)
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('ID da tarefa inválida')
	})

	it('should not be able add item in checklist without data', async () => {
		let errorMessage = ''

		try {
			await addTaskChecklistUseCase.execute()
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('Nenhuma informação para criar checklist')
	})

	it('should be able add item in checklist', async () => {
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

		await addTaskChecklistUseCase.execute(
			generic,
			task_id,
			workspace_id,
			user_id
		)

		const tasks = await findTaskByWorkspaceUseCase.execute(
			workspace_id,
			user_id
		)

		const task = tasks.find((task) => task._id === task_id)

		expect(task.checklist[0].description).toBe(generic.description)
	})
})
