import { UserModel } from '@models/UserModel'

export interface CreateUserDTO
	extends Omit<
		UserModel,
		| '_id'
		| 'token'
		| 'encrypt'
		| 'setPassword'
		| 'addWorkspace'
		| 'updateWorkspace'
	> {}

export interface UserRepositoryContract {
	userCreate(data: CreateUserDTO): Promise<string>
	userUpdate(user_id: string, data: Object): Promise<void>
	userDelete(user_id: string): Promise<void>
	userGetByID(user_id: string): Promise<Required<UserModel> | undefined>
}
