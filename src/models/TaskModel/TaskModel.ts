import { Model } from '..'

export type Checklist = {
	description: string
	done: boolean
}

export class TaskModel extends Model {
	public step_id: string
	public title: string
	public members_id?: string[]
	public description?: string
	public doneAt?: Date
	public checklist?: Checklist[]

	constructor(props: TaskModel, _id?: string) {
		super({ ...props, _id } as Model)

		this.title = props.title
		this.description = props.description ?? ''
		this.doneAt = props.doneAt
		this.step_id = props.step_id

		this.checklist = props.checklist ?? []
		this.members_id = props.members_id ?? []
	}
}
