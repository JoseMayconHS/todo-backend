import { TaskModel } from '@models/TaskModel'

import { CreateTaskDTO, TaskRepositoryContract } from '../TaskRepository'

export class MockTaskRepository implements TaskRepositoryContract {
	async create(data: CreateTaskDTO): Promise<string> {
		const Task = new TaskModel(data)

		return Task.id
	}
}
