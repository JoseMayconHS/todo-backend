export interface TaskMemberRepositoryContract {
	addTaskMember(
		member_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
	deleteTaskMember(
		step_id: string,
		task_id: string,
		workspace_id: string,
		user_id: string
	): Promise<void>
}
