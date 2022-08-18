import { TaskModel } from '@models/TaskModel/TaskModel'
import { CreateWorkspaceDTO } from '@repositories/userRepository/WorkspaceRepository'
import { v4 } from 'uuid'
import { Model } from '..'

export type Step = {
	_id?: string
	label: string
	index?: number
}

export type CreateStepDTO = Omit<Step, '_id'>

export class WorkspaceModel extends Model {
	public title: string
	public members_id: string[]
	public favorite: boolean
	public description: string
	public tasks: TaskModel[]
	public steps: Required<Step>[]

	static createStep(data: CreateStepDTO): Required<Step> {
		return {
			_id: v4(),
			label: data.label,
			index: data.index ?? 0,
		}
	}

	constructor(props: CreateWorkspaceDTO, _id?: string) {
		super({ ...props, _id } as Model)

		this.title = props.title
		this.favorite = !!props.favorite
		this.description = props.description ?? ''
		this.tasks = props.tasks ?? []
		this.members_id = props.members_id ?? []
		this.steps = props.steps ?? [
			WorkspaceModel.createStep({
				label: 'A fazer',
				index: 1,
			}),
			WorkspaceModel.createStep({
				label: 'Fazendo',
				index: 2,
			}),
			WorkspaceModel.createStep({
				label: 'Concluído',
				index: 3,
			}),
		]
	}

	addMember(member_id: string) {
		this.members_id.push(member_id)
	}

	deleteMember(member_id: string) {
		const member_index = this.members_id.findIndex(
			(member) => member === member_id
		)

		if (member_index !== -1) {
			this.members_id.splice(member_index, 1)
		}
	}

	toObj(): CreateWorkspaceDTO {
		const object = {
			...this,
		}

		delete object.addMember
		delete object.deleteMember

		return object
	}
}
