import { UserRepositoryContract } from '../UserRepository'

import { WorkspaceMemberRepositoryContract } from '../WorkspaceMemberRepository'

export class WorkspaceMemberRepository
	implements WorkspaceMemberRepositoryContract
{
	constructor(private UserRepository: UserRepositoryContract) {}

	async addWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.addMemberToWorkspace(workspace_id, member_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}

	async deleteWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		const user = await this.UserRepository.userGetByID(user_id)

		if (user) {
			user.deleteMemberInWorkspace(workspace_id, member_id)

			await this.UserRepository.userUpdate(user_id, {
				workspaces: user.workspaces,
			})
		}
	}
}
