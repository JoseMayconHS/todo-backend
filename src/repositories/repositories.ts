import { MockUserRepository } from './userRepository/mock/mockUserRepository'

const production = process.env.NODE_ENV === 'production'

export const UserRepository = production
	? MockUserRepository
	: MockUserRepository
