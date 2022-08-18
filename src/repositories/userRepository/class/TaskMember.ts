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
		step_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {}

	async addWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.addMemberToWorkspace(workspace_id, member_id)
		}
	}

	async deleteWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		const workspace = user.getWorkspace(workspace_id)

		workspace.deleteMember(member_id)

		user.updateWorkspace(workspace_id, {
			members_id: workspace.members_id,
		})
	}
}
