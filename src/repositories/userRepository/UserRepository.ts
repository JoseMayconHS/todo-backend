import { UserModel } from '@models/UserModel'
import {
	LoginUser,
	LoginUserResponse,
} from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

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
	userLogin(data: LoginUser): Promise<LoginUserResponse | Error>
	userCreate(data: CreateUserDTO): Promise<string>
	userUpdate(user_id: string, data: Object): Promise<void>
	userDelete(user_id: string): Promise<void>
	userGetByID(user_id: string): Promise<Required<UserModel> | undefined>
	userGetByEmail(email: string): Promise<Required<UserModel> | undefined>
}
