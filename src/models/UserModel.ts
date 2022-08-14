import { Model } from '.'
import { CreateUserDTO } from './../repositories/userRepository/UserRepository'
import { CreateWorkspaceDTO } from './../repositories/userRepository/WorkspaceRepository'
import { WorkspaceModel } from './WorkspaceModel'

export type Checklist = {
	description: string
	done: boolean
}

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

	async token() {
		// (STAND BY)
		return `Token do usuário ${this._id}`
	}

	async encrypt(password: string) {
		// (STAND BY)
		this.password = 'Senha encriptada'
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
}
