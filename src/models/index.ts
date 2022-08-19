import { v4 } from 'uuid'

export abstract class Model {
	public readonly _id?: string
	protected readonly created_at?: number
	protected update_at?: number

	constructor(props: Model) {
		this._id = props._id ?? v4()
		this.created_at = props.created_at || Date.now()
		this.update_at = props.update_at || Date.now()
	}
}
