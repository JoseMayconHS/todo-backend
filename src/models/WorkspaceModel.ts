import { TaskModel } from '@models/TaskModel'
import { Model } from '.'
import { CreateWorkspaceDTO } from './../repositories/userRepository/WorkspaceRepository'

export type Checklist = {
	description: string
	done: boolean
}

export class WorkspaceModel extends Model {
	public title: string
	public members_id?: string[]
	public favorite?: boolean
	public description?: string
	public tasks?: TaskModel[]

	constructor(props: CreateWorkspaceDTO, _id?: string) {
		super({ ...props, _id } as Model)

		this.title = props.title
		this.favorite = !!props.favorite
		this.description = props.description ?? ''
		this.tasks = props.tasks ?? []
		this.members_id = props.members_id ?? []
	}
}
