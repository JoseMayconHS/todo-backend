import { Model } from '.'

export type Checklist = {
	description: string
	done: boolean
}

export class TaskModel extends Model {
	public step_id: string
	public title: string
	public description?: string
	public doneAt?: Date
	public checklist?: Checklist[]

	constructor(props: TaskModel) {
		super(props)

		this.title = props.title
		this.description = props.description ?? ''
		this.doneAt = props.doneAt
		this.step_id = props.step_id

		this.checklist = props.checklist ?? []
	}
}
