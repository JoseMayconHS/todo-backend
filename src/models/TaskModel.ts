import { v4 } from 'uuid'

export type Checklist = {
	description: string
	done: boolean
}

export class TaskModel {
	private readonly _id: string

	public workspace_id: string
	public step_id: string
	public title: string
	public description?: string
	public doneAt?: Date
	public checklist?: Checklist[]

	constructor(props: Omit<TaskModel, 'id'>, _id?: string) {
		this.title = props.title
		this.description = props.description ?? ''
		this.doneAt = props.doneAt
		this.step_id = props.step_id
		this.workspace_id = props.workspace_id

		this.checklist = props.checklist ?? []
		this._id = _id ?? v4()
	}

	get id() {
		return this._id
	}
}
