import { MockTaskRepository } from './userRepository/mock/mockTaskRepository'
import { MockUserRepository } from './userRepository/mock/mockUserRepository'
import { MockWorkspaceRepository } from './userRepository/mock/mockWorkspaceRepository'
import { MockWorkspaceStepRepository } from './userRepository/mock/mockWorkspaceStepRepository'

const production = process.env.NODE_ENV === 'production'

export const TaskRepository = production
	? MockTaskRepository
	: MockTaskRepository

export const WorkspaceStepRepository = production
	? MockWorkspaceStepRepository
	: MockWorkspaceStepRepository

export const WorkspaceRepository = production
	? MockWorkspaceRepository
	: MockWorkspaceRepository

export const UserRepository = production
	? MockUserRepository
	: MockUserRepository
