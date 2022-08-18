import { UserRepositoryContract } from '../UserRepository'

import { WorkspaceMemberRepositoryContract } from '../WorkspaceMemberRepository'

export class MockWorkspaceMemberRepository
	implements WorkspaceMemberRepositoryContract
{
	constructor(private UserRepository: UserRepositoryContract) {}

	async addWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void> {
		if (await this.UserRepository.userExists(member_id)) {
			const user = await this.UserRepository.userGetByID(user_id)

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
