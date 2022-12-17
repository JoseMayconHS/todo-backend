import { UserRepository } from '@repositories/repositories'

import { GraphContext } from '@server/config/context'

import { WorkspaceModel } from '@models/WorkspaceModel/WorkspaceModel'
import { WorkspaceRepository } from '@repositories/userRepository/class/Workspace'
import { SimpleOutput } from '@server/graphs/typeDefs'
import {
	WorkspaceCreateInput,
	WorkspaceCreateOutput,
} from '@server/graphs/typeDefs/Workspaces'
import { FindUserByIDUseCase } from '@useCases/User/FindUserByIDUseCase/FindUserByIDUseCase'
import { UpdateUserUseCase } from '@useCases/User/UpdateUserUseCase/UpdateUserUseCase'
import { DeleteWorkspaceByUserUseCase } from '@useCases/Workspace/DeleteWorkspaceByUserUseCase/DeleteWorkspaceByUserUseCase'
import { UpdateWorkspaceByUserUseCase } from '@useCases/Workspace/UpdateWorkspaceByUserUseCase/UpdateWorkspaceByUserUseCase'

export const WorkspaceMutation = {
	async createWorkspace(
		_,
		{ data }: { data: WorkspaceCreateInput },
		ctx: GraphContext
	): Promise<WorkspaceCreateOutput> {
		try {
			await ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)
			const updateUserUseCase = new UpdateUserUseCase(userRepository)

			const User = await findUserByIDUseCase.execute(ctx.payload._id)

			if (User) {
				const Workspace = new WorkspaceModel({
					...data,
					steps: [],
					tasks: [],
				})

				const { _id } = User.addWorkspace(Workspace)

				await updateUserUseCase.execute(ctx.payload._id, User.payload(true))

				return {
					_id,
					ok: true,
					message: 'Workspace criado com sucesso',
				}
			} else {
				return {
					ok: true,
					message: 'Usuário não encontrado',
				}
			}
		} catch (e) {
			return {
				ok: false,
			}
		}
	},
	async removeWorkspace(
		_,
		{ workspace_id },
		ctx: GraphContext
	): Promise<SimpleOutput> {
		try {
			await ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const workspaceRepository = new WorkspaceRepository(userRepository)

			const deleteWorkspaceByUserUseCase = new DeleteWorkspaceByUserUseCase(
				workspaceRepository
			)

			await deleteWorkspaceByUserUseCase.execute(workspace_id, ctx.payload._id)

			return {
				ok: true,
				message: 'Workspace apagado com sucesso',
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async updateWorkspace(
		_,
		{ workspace_id, data },
		ctx: GraphContext
	): Promise<SimpleOutput> {
		try {
			await ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const workspaceRepository = new WorkspaceRepository(userRepository)

			const updateWorkspaceByUserUseCase = new UpdateWorkspaceByUserUseCase(
				workspaceRepository
			)

			await updateWorkspaceByUserUseCase.execute(
				workspace_id,
				ctx.payload._id,
				data
			)

			return {
				ok: true,
				message: 'Workspace atualizado com sucesso',
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
}
