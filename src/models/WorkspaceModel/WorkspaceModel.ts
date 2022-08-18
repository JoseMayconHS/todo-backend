import { TaskModel, TaskPayload } from '@models/TaskModel/TaskModel'
import { CreateTaskDTO } from '@repositories/userRepository/TaskRepository'
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

	getTask(task_id: string) {
		const task = this.tasks.find((task) => task._id === task_id)

		return task
	}

	addTask(data: CreateTaskDTO): Required<TaskModel> {
		const task = new TaskModel(data) as Required<TaskModel>

		this.tasks.push(task)

		return task
	}

	updateTask(task_id: string, data: Partial<TaskPayload>) {
		const task_index = this.tasks.findIndex((task) => task._id === task_id)

		if (task_index !== -1) {
			const task = this.getTask(task_id)

			const task_updated = new TaskModel(
				{
					...task.toObj(),
					...data,
				},
				task._id
			)

			this.tasks.splice(task_index, 1, task_updated)
		}
	}

	deleteTask(task_id: string) {
		const task_index = this.tasks.findIndex((task) => task._id === task_id)

		if (task_index !== -1) {
			this.tasks.splice(task_index, 1)
		}
	}

	getStep(step_id: string) {
		const step = this.steps.find((step) => step._id === step_id)

		return step
	}

	addStep(data: CreateStepDTO): Required<Step> {
		const step = WorkspaceModel.createStep(data)

		this.steps.push(step)

		return step
	}

	updateStep(step_id: string, data: Partial<Step>) {
		const step_index = this.steps.findIndex((step) => step._id === step_id)

		if (step_index !== -1) {
			const step = this.getStep(step_id)

			const step_updated = {
				...step,
				...data,
			}

			this.steps.splice(step_index, 1, step_updated)
		}
	}

	deleteStep(step_id: string) {
		const step_index = this.steps.findIndex((step) => step._id === step_id)

		if (step_index !== -1) {
			this.steps.splice(step_index, 1)
		}
	}

	toObj(): CreateWorkspaceDTO {
		const object = {
			...this,
		}

		delete object.addMember
		delete object.deleteMember

		delete object.getStep
		delete object.addStep
		delete object.updateStep
		delete object.deleteStep

		delete object.addTask
		delete object.updateTask
		delete object.deleteTask
		delete object.getTask

		return object
	}
}
