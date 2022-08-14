import bcryptjs from 'bcryptjs'
import jsonwebtoken from 'jsonwebtoken'
import { v1 } from 'uuid'

import { Model } from '.'
import { CreateUserDTO } from './../repositories/userRepository/UserRepository'
import { CreateWorkspaceDTO } from './../repositories/userRepository/WorkspaceRepository'
import { WorkspaceModel } from './WorkspaceModel'

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
		| 'addWorkspace'
		| 'updateWorkspace'
		| 'comparePassword'
		| 'toObj'
		| 'payload'
	> {}

export interface UserObj extends Omit<UserPayload, 'password'> {}

export class UserModel extends Model {
	public name: string
	public email: string
	public password: string

	public workspaces?: WorkspaceModel[]

	constructor(props: CreateUserDTO, _id?: string) {
		super({ ...props, _id } as Model)

		this.name = props.name
		this.email = props.email
		this.workspaces = props.workspaces ?? []
		this.setPassword(props.password, !!_id)
	}

	async setPassword(password: string, noEncrypt: boolean) {
		if (noEncrypt) {
			this.password = password
		} else {
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

	encrypt(password: string) {
		const salt = bcryptjs.genSaltSync()

		const hash = bcryptjs.hashSync(password, salt)

		this.password = hash
	}

	async comparePassword(password: string) {
		return await bcryptjs.compare(password, this.password)
	}

	addWorkspace(workspace: WorkspaceModel) {
		this.workspaces.push(workspace)
	}

	updateWorkspace(workspace_id: string, data: Partial<CreateWorkspaceDTO>) {
		const index = this.workspaces.findIndex(
			(workspace) => workspace._id === workspace_id
		)

		if (index !== -1) {
			const workspace_updated = new WorkspaceModel(
				{
					...this.workspaces[index],
					...data,
				},
				workspace_id
			)

			this.workspaces.splice(index, 1, workspace_updated)
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
		delete payload.setPassword
		delete payload.updateWorkspace
		delete payload.encrypt
		delete payload.addWorkspace
		delete payload.payload
		delete payload.comparePassword
		delete payload.toObj

		return payload
	}
}
