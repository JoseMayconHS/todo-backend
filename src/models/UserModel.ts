import { Model } from '.'
import { WorkspaceModel } from './WorkspaceModel'

export type Checklist = {
	description: string
	done: boolean
}

export class UserModel extends Model {
	public name: string
	public email: string
	public password: string

	public workspaces: WorkspaceModel[]

	constructor(props: UserModel) {
		super(props)

		this.name = props.name
		this.email = props.email
		this.workspaces = props.workspaces ?? []
		this.encrypt(props.password)
	}

	async token() {
		return `Token do usuário ${this._id}`
	}
	async encrypt(password: string) {
		if (this._id) {
			this.password = password
		} else {
			this.password = 'Senha encriptada'
		}
	}
}
