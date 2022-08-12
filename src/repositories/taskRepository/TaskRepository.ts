import { TaskModel } from '@models/TaskModel'

export interface CreateTaskDTO extends Omit<TaskModel, 'doneAt' | 'id'> {}

export interface TaskRepositoryContract {
	create(data: CreateTaskDTO): Promise<string>
	update(id: string, data: Object): Promise<void>
	delete(id: string): Promise<void>
}
