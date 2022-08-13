import { TaskModel } from '@models/TaskModel'
import { Model } from '.'

export type Checklist = {
	description: string
	done: boolean
}

export class WorkspaceModel extends Model {
	public title: string
	public favorite: boolean
	public description?: string
	public tasks?: TaskModel[]

	constructor(props: WorkspaceModel) {
		super(props)

		this.title = props.title
		this.favorite = !!props.favorite
		this.description = props.description ?? ''
		this.tasks = props.tasks ?? []
	}
}
