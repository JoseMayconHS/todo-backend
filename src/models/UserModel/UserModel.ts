import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { v1 } from 'uuid'

import { TaskModel } from '@models/TaskModel/TaskModel'
import {
	CreateStepDTO,
	Step,
	WorkspaceModel,
} from '@models/WorkspaceModel/WorkspaceModel'
import { CreateTaskDTO } from '@repositories/userRepository/TaskRepository'
import { CreateUserDTO } from '@repositories/userRepository/UserRepository'
import { CreateWorkspaceDTO } from '@repositories/userRepository/WorkspaceRepository'
import { Model } from '..'

export type Checklist = {
	description: string
	done: boolean
}

export interface UserPayload
	extends Omit<
		UserModel,
		| 'token'
		| 'encrypt'
		| 'setPassword'
		| 'comparePassword'
		| 'getWorkspace'
		| 'addWorkspace'
		| 'updateWorkspace'
		| 'deleteWorkspace'
		| 'addTask'
		| 'updateTask'
		| 'deleteTask'
		| 'addStepToWorkspace'
		| 'updateStepInWorkspace'
		| 'deleteStepInWorkspace'
		| 'addMemberToWorkspace'
		| 'deleteMemberInWorkspace'
		| 'toObj'
		| 'payload'
	> {}

export interface UserObj extends Omit<UserPayload, 'password'> {}

export class UserModel extends Model {
	public name: string
	public email: string
	public password: string

	public workspaces: WorkspaceModel[]

	static validatePassword(password: string) {
		if (!password.length) {
			throw new Error('Senha inválida')
		} else if (password.length < 6) {
			throw new Error('Senha muito curta')
		}
	}

	static validateEmail(email: string) {
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			throw new Error('E-mail mal formatado')
		}

		return true
	}

	static validateName(name: string) {
		if (!name.length) {
			throw new Error('Nome inválido')
		}

		return true
	}

	constructor(props: CreateUserDTO, _id?: string) {
		super({ ...props, _id } as Model)

		this.workspaces = props.workspaces ?? []
		this.setName(props.name)
		this.setEmail(props.email)
		this.setPassword(props.password, !!_id)
	}

	setName(name: string) {
		if (UserModel.validateName(name)) {
			this.name = name
		}
	}

	setEmail(email: string) {
		if (UserModel.validateEmail(email)) {
			this.email = email
		}
	}

	async setPassword(password: string, noEncrypt?: boolean) {
		if (noEncrypt) {
			this.password = password
		} else {
			UserModel.validatePassword(password)
			this.encrypt(password)
		}
	}

	token() {
		const token = jsonwebtoken.sign(
			{
				...this.payload(),
				token_id: v1(),
			},
			process.env.JWT_SECRET,
			{
				expiresIn: '24h',
			}
		)

		return `Bearer ${token}`
	}

	encrypt(password = this.password) {
		const salt = bcryptjs.genSaltSync()

		const hash = bcryptjs.hashSync(password, salt)

		this.password = hash
	}

	comparePassword(password: string) {
		return bcryptjs.compareSync(password, this.password)
	}

	getWorkspace(workspace_id: string) {
		const workspace = this.workspaces.find(
			(workspace) => workspace._id === workspace_id
		)

		return workspace
	}

	addWorkspace(data: WorkspaceModel): Required<WorkspaceModel> {
		const workspace = new WorkspaceModel(data) as Required<WorkspaceModel>

		this.workspaces.push(workspace)

		return workspace
	}

	updateWorkspace(workspace_id: string, data: Partial<CreateWorkspaceDTO>) {
		const index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const workspace_updated = new WorkspaceModel(
				{
					...this.workspaces[index].toObj(),
					...data,
				},
				workspace_id
			)

			this.workspaces.splice(index, 1, workspace_updated)
		}
	}

	deleteWorkspace(workspace_id: string) {
		const index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			this.workspaces.splice(index, 1)
		}
	}

	addTask(workspace_id: string, data: CreateTaskDTO): Required<TaskModel> {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const task = new TaskModel(data) as Required<TaskModel>

			this.workspaces[workspace_index].tasks.push(task)

			return task
		}
	}

	updateTask(
		task_id: string,
		workspace_id: string,
		data: Partial<CreateTaskDTO>
	) {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const workspace = this.workspaces[workspace_index]

			const task_index = workspace.tasks.findIndex(
				(task) => task._id === task_id
			)

			const task_updated = new TaskModel(
				{
					...workspace.tasks[task_index].toObj(),
					...data,
				},
				task_id
			)

			this.workspaces[workspace_index].tasks.splice(task_index, 1, task_updated)
		}
	}

	deleteTask(task_id: string, workspace_id: string) {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const workspace = this.workspaces[workspace_index]

			const task_index = workspace.tasks.findIndex(
				(task) => task._id === task_id
			)

			this.workspaces[workspace_index].tasks.splice(task_index, 1)
		}
	}

	addStepToWorkspace(
		workspace_id: string,
		data: CreateStepDTO
	): Required<Step> {
		const index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const step = WorkspaceModel.createStep(data)

			this.workspaces[index].steps.push(step)

			return step
		}
	}

	updateStepInWorkspace(
		step_id: string,
		workspace_id: string,
		data: Partial<CreateStepDTO>
	) {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const step_index = this.workspaces[workspace_index].steps.findIndex(
				(step) => step._id === step_id
			)

			if (step_index !== -1) {
				const step = this.workspaces[workspace_index].steps[step_index]

				const step_updated = {
					...step,
					...data,
					_id: step_id,
				}

				this.workspaces[workspace_index].steps.splice(
					step_index,
					1,
					step_updated
				)
			}
		}
	}

	deleteStepInWorkspace(step_id: string, workspace_id: string) {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const step_index = this.workspaces[workspace_index].steps.findIndex(
				(step) => step._id === step_id
			)

			if (step_index !== -1) {
				this.workspaces[workspace_index].steps.splice(step_index, 1)
			}
		}
	}

	addMemberToWorkspace(
		workspace_id: string,
		member_id: string
	): Required<void> {
		const workspace = this.getWorkspace(workspace_id)

		workspace.addMember(member_id)

		this.updateWorkspace(workspace_id, {
			members_id: workspace.members_id,
		})
	}

	deleteMemberInWorkspace(step_id: string, workspace_id: string) {
		const workspace_index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (workspace_index !== -1) {
			const step_index = this.workspaces[workspace_index].steps.findIndex(
				(step) => step._id === step_id
			)

			if (step_index !== -1) {
				this.workspaces[workspace_index].steps.splice(step_index, 1)
			}
		}
	}

	toObj(): UserObj {
		const user_obj = this.payload()

		delete user_obj.password

		return user_obj
	}

	payload(): UserPayload {
		const payload = {
			...this,
		}

		delete payload.token
		delete payload.comparePassword
		delete payload.setPassword
		delete payload.encrypt
		delete payload.payload
		delete payload.toObj

		delete payload.getWorkspace
		delete payload.addWorkspace
		delete payload.deleteWorkspace
		delete payload.updateWorkspace

		delete payload.addTask
		delete payload.updateTask
		delete payload.deleteTask

		delete payload.addStepToWorkspace
		delete payload.updateStepInWorkspace
		delete payload.deleteStepInWorkspace

		delete payload.addMemberToWorkspace
		delete payload.deleteMemberInWorkspace

		return payload
	}
}
