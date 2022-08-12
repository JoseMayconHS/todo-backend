import { TaskRepositoryContract } from './../../../repositories/taskRepository/TaskRepository'
export class FindByWorkspaceUseCase {
	constructor(private TaskRepository: TaskRepositoryContract) {}

	async execute(workspace_id: string) {
		if (!workspace_id) {
			throw new Error('workspace_id inválido')
		}

		const tasks = await this.TaskRepository.findByWorkspace(workspace_id)

		return tasks
	}
}
