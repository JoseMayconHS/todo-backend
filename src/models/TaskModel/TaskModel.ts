import { v4 } from 'uuid'

import { CreateTaskChecklistDTO } from '@repositories/userRepository/TaskChecklistRepository'
import { CreateTaskDTO } from '@repositories/userRepository/TaskRepository'
import { Model } from '..'

export type Checklist = {
	_id?: string
	description: string
	done: boolean
}

export type TaskPayload = Omit<
	TaskModel,
	| 'addChecklist'
	| 'updateChecklist'
	| 'deleteChecklist'
	| 'addMember'
	| 'deleteMember'
	| 'toObj'
>

export class TaskModel extends Model {
	public step_id: string
	public title: string
	public members_id: string[]
	public description: string
	public doneAt: Date | undefined
	public checklist: Checklist[]
	public priority: 1 | 2 | 3

	static createChecklist(data: CreateTaskChecklistDTO): Required<Checklist> {
		return {
			_id: v4(),
			...data,
		}
	}

	constructor(props: CreateTaskDTO, _id?: string) {
		super({ ...props, _id } as Model)

		this.title = props.title
		this.doneAt = props.doneAt
		this.step_id = props.step_id

		this.description = props.description ?? ''
		this.priority = props.priority ?? 1

		this.checklist = props.checklist ?? []
		this.members_id = props.members_id ?? []
	}

	addChecklist(data: CreateTaskChecklistDTO): Required<Checklist> {
		const checklist = TaskModel.createChecklist(data)

		this.checklist.push(checklist)

		return checklist
	}

	updateChecklist(checkitem_id: string, data: Partial<CreateTaskChecklistDTO>) {
		const checkitem_index = this.checklist.findIndex(
			(checkitem) => checkitem._id === checkitem_id
		)

		if (checkitem_index !== -1) {
			const checkitem = this.checklist[checkitem_index]

			const checkitem_updated = {
				...checkitem,
				...data,
				_id: checkitem_id,
			}

			this.checklist.splice(checkitem_index, 1, checkitem_updated)
		}
	}

	deleteChecklist(checkitem_id: string) {
		const checkitem_index = this.checklist.findIndex(
			(checkitem) => checkitem._id === checkitem_id
		)

		if (checkitem_index !== -1) {
			this.checklist.splice(checkitem_index, 1)
		}
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

	toObj(): CreateTaskDTO {
		const object = {
			...this,
		}

		delete object.addMember
		delete object.deleteMember

		delete object.addChecklist
		delete object.updateChecklist
		delete object.deleteChecklist

		return object
	}
}
