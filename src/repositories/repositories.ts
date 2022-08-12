import { MockTaskRepository } from './taskRepository/mock/mockTaskRepository'

const production = process.env.NODE_ENV === 'production'

export const TaskRepository = production
	? MockTaskRepository
	: MockTaskRepository
