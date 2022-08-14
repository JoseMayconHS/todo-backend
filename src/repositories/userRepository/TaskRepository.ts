import { TaskModel } from '@models/TaskModel'

export interface CreateTaskDTO extends Omit<TaskModel, 'doneAt' | '_id'> {}

export interface TaskRepositoryContract {
	taskCreate(
		data: CreateTaskDTO,
		workspace_id: string,
		user_id: string
	): Promise<string>
	taskUpdate(
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void>
	taskDelete(
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
	taskGetByWorkspace(
		workspace_id: string,
		user_id: string
	): Promise<TaskModel[]>
}
