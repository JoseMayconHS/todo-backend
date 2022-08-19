import { TaskMemberRepositoryContract } from '../TaskMemberRepository'
import { UserRepositoryContract } from '../UserRepository'

export class TaskMemberRepository implements TaskMemberRepositoryContract {
	constructor(private UserRepository: UserRepositoryContract) {}

	async addTaskMember(
		member_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.addMemberToTask(task_id, workspace_id, member_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}

	async deleteTaskMember(
		member_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.deleteMemberInTask(task_id, workspace_id, member_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
}
