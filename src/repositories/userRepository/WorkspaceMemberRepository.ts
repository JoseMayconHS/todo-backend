export interface WorkspaceMemberRepositoryContract {
	addWorkspaceMember(
		member_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
	deleteWorkspaceMember(
		step_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
}
