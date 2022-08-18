import { Checklist } from '@models/TaskModel/TaskModel'

export interface CreateTaskChecklistDTO extends Omit<Checklist, '_id'> {}

export interface TaskChecklistContract {
	taskChecklistCreate(
		data: CreateTaskChecklistDTO,
		workspace_id: string,
		user_id: string
	): Promise<string>
	taskChecklistUpdate(
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void>
	taskChecklistDelete(
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
}
