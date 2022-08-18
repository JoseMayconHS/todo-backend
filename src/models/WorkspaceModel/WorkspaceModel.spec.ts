import { WorkspaceModel } from './WorkspaceModel'

describe('WorkspaceModel', () => {
	it('should not be able create a new ID', () => {
		const hash_id = 'HASH_ID'

		const workspace = new WorkspaceModel(
			{
				title: 'Dia-a-dia',
			},
			hash_id
		)

		expect(workspace._id).toBe(hash_id)
	})

	it('should be able create ID', () => {
		const workspace = new WorkspaceModel({
			title: 'Dia-a-dia',
		})

		expect(workspace).toHaveProperty('_id')
	})
	it('should be able create Workspace', () => {
		const title = 'Dia-a-dia'

		const workspace = new WorkspaceModel({
			title,
		})

		expect(workspace).toHaveProperty('title', title)
		expect(workspace).toHaveProperty('description', '')
		expect(workspace.steps).toHaveLength(3)
		expect(workspace.favorite).not.toBeTruthy()
		expect(workspace.members_id).toHaveLength(0)
		expect(workspace.tasks).toHaveLength(0)
	})

	it('should be able add member_id', () => {
		const workspace = new WorkspaceModel({
			title: 'Dia-a-dia',
		})

		expect(workspace.members_id).toHaveLength(0)

		workspace.addMember('123')

		expect(workspace.members_id).toHaveLength(1)
	})

	it('should be able delete member_id', () => {
		const workspace = new WorkspaceModel({
			title: 'Dia-a-dia',
		})

		expect(workspace.members_id).toHaveLength(0)

		workspace.addMember('123')

		expect(workspace.members_id).toHaveLength(1)

		workspace.deleteMember('123')

		expect(workspace.members_id).toHaveLength(0)
	})
})
