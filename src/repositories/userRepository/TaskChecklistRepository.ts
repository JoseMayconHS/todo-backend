import { Checklist } from '@models/TaskModel/TaskModel'

export interface CreateTaskChecklistDTO extends Omit<Checklist, '_id'> {}

export interface TaskChecklistRepositoryContract {
	taskChecklistCreate(
		data: CreateTaskChecklistDTO,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<string>
	taskChecklistUpdate(
		checkitem_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void>
	taskChecklistDelete(
		checkitem_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
}
