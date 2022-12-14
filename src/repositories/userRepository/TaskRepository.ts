import { TaskModel } from '@models/TaskModel/TaskModel'

export interface CreateTaskDTO extends Omit<TaskModel, '_id'> {}

export interface TaskRepositoryContract {
	taskCreate(
		data: CreateTaskDTO,
		workspace_id: string,
		user_id: string
	): Promise<string | undefined>
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
