import { UserModel, UserPayload } from '@models/UserModel/UserModel'
import {
	LoginUser,
	LoginUserResponse,
} from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

export interface CreateUserDTO extends Omit<UserPayload, '_id'> {}

export interface UserRepositoryContract {
	userLogin(data: LoginUser, reconnect?: boolean): Promise<LoginUserResponse>
	userCreate(data: CreateUserDTO): Promise<string>
	userUpdate(user_id: string, data: Partial<UserPayload>): Promise<void>
	userDelete(user_id: string): Promise<void>
	userGetByID(user_id: string): Promise<Required<UserModel> | undefined>
	userGetByEmail(email: string): Promise<Required<UserModel> | undefined>
}
