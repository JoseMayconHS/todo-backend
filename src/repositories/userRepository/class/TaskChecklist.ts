import {
	CreateTaskChecklistDTO,
	TaskChecklistContract,
} from '../TaskChecklistRepository'
import { UserRepositoryContract } from '../UserRepository'

export class TaskChecklistRepository implements TaskChecklistContract {
	constructor(private UserRepository: UserRepositoryContract) {}

	async taskChecklistCreate(
		data: CreateTaskChecklistDTO,
		workspace_id: string,
		user_id: string
	): Promise<string> {
		return ''
	}

	async taskChecklistDelete(
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {}

	async taskChecklistUpdate(
		task_id: string,
		workspace_id: string,
		user_id: string,
		data: Object
	): Promise<void> {}
}
