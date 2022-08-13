import { v4 } from 'uuid'

export abstract class Model {
	public readonly _id?: string
	protected readonly created_at?: Date
	protected update_at?: Date

	constructor(props: Model) {
		this._id = props._id ?? v4()
		this.created_at = props.created_at
		this.update_at = props.update_at
	}
}
