import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { v1 } from 'uuid'

import { Checklist, TaskModel } from '@models/TaskModel/TaskModel'
import {
	CreateStepDTO,
	Step,
	WorkspaceModel,
} from '@models/WorkspaceModel/WorkspaceModel'
import { CreateTaskChecklistDTO } from '@repositories/userRepository/TaskChecklistRepository'
import { CreateTaskDTO } from '@repositories/userRepository/TaskRepository'
import { CreateUserDTO } from '@repositories/userRepository/UserRepository'
import { CreateWorkspaceDTO } from '@repositories/userRepository/WorkspaceRepository'
import { Model } from '..'

export interface UserPayload
	extends Omit<
		UserModel,
		| 'token'
		| 'encrypt'
		| 'setPassword'
		| 'setName'
		| 'setEmail'
		| 'comparePassword'
		| 'getWorkspace'
		| 'addWorkspace'
		| 'updateWorkspace'
		| 'deleteWorkspace'
		| 'addTask'
		| 'updateTask'
		| 'deleteTask'
		| 'addMemberToTask'
		| 'deleteMemberInTask'
		| 'addChecklistItemInTask'
		| 'updateChecklistItemInTask'
		| 'deleteChecklistItemInTask'
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
			const workspace = this.getWorkspace(workspace_id)

			const workspace_updated = new WorkspaceModel(
				{
					...workspace.toObj(),
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
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.addTask(data)

		this.updateWorkspace(workspace_id, workspace)

		return task
	}

	updateTask(
		task_id: string,
		workspace_id: string,
		data: Partial<CreateTaskDTO>
	) {
		const workspace = this.getWorkspace(workspace_id)

		workspace.updateTask(task_id, data)

		this.updateWorkspace(workspace_id, workspace)
	}

	deleteTask(task_id: string, workspace_id: string) {
		const workspace = this.getWorkspace(workspace_id)

		workspace.deleteTask(task_id)

		this.updateWorkspace(workspace_id, workspace)
	}

	addStepToWorkspace(
		workspace_id: string,
		data: CreateStepDTO
	): Required<Step> {
		const workspace = this.getWorkspace(workspace_id)

		const step = workspace.addStep(data)

		this.updateWorkspace(workspace_id, workspace)

		return step
	}

	updateStepInWorkspace(
		step_id: string,
		workspace_id: string,
		data: Partial<CreateStepDTO>
	) {
		const workspace = this.getWorkspace(workspace_id)

		workspace.updateStep(step_id, data)

		this.updateWorkspace(workspace_id, workspace)
	}

	deleteStepInWorkspace(step_id: string, workspace_id: string) {
		const workspace = this.getWorkspace(workspace_id)

		workspace.deleteStep(step_id)

		this.updateWorkspace(workspace_id, workspace)
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

	deleteMemberInWorkspace(workspace_id: string, member_id: string) {
		const workspace = this.getWorkspace(workspace_id)

		workspace.deleteMember(member_id)

		this.updateWorkspace(workspace_id, {
			members_id: workspace.members_id,
		})
	}

	addMemberToTask(
		task_id: string,
		workspace_id: string,
		member_id: string
	): Required<void> {
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.getTask(task_id)

		task.addMember(member_id)

		this.updateTask(task_id, workspace_id, {
			members_id: task.members_id,
		})
	}

	deleteMemberInTask(task_id: string, workspace_id: string, member_id: string) {
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.getTask(task_id)

		task.deleteMember(member_id)

		this.updateTask(task_id, workspace_id, {
			members_id: task.members_id,
		})
	}

	addChecklistItemInTask(
		task_id: string,
		workspace_id: string,
		data: CreateTaskChecklistDTO
	): Required<Checklist> {
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.getTask(task_id)

		const checkitem = task.addChecklist(data)

		this.updateTask(task_id, workspace_id, {
			checklist: task.checklist,
		})

		return checkitem
	}

	updateChecklistItemInTask(
		checkitem_id: string,
		task_id: string,
		workspace_id: string,
		data: Partial<CreateTaskChecklistDTO>
	): Required<void> {
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.getTask(task_id)

		task.updateChecklist(checkitem_id, data)

		this.updateTask(task_id, workspace_id, {
			checklist: task.checklist,
		})
	}

	deleteChecklistItemInTask(
		checkitem_id: string,
		task_id: string,
		workspace_id: string
	) {
		const workspace = this.getWorkspace(workspace_id)

		const task = workspace.getTask(task_id)

		task.deleteChecklist(checkitem_id)

		this.updateTask(task_id, workspace_id, {
			checklist: task.checklist,
		})
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

		return payload
	}
}
