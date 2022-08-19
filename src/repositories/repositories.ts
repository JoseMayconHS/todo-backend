import { MockUserRepository } from './userRepository/mock/mockUserRepository'
import { MongoUserRepository } from './userRepository/mongo/mongoUserRepository'

const test = process.env.NODE_ENV === 'test'

export const UserRepository = test ? MockUserRepository : MongoUserRepository
