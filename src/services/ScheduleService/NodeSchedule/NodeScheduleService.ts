import schedule from 'node-schedule'

import { InMemoryService } from '@services/InMemoryService/InMemoryService'

import { ScheduleJobService } from '../ScheduleJobService'

type NodeScheduleServiceProps = {
	InMemoryBlackListService: InMemoryService
}

export class NodeScheduleService implements ScheduleJobService {
	constructor(private NodeScheduleServiceProps: NodeScheduleServiceProps) {}

	cleanBlacklist(keysPattern: string): void {
		// TODOS OS DIAS A MEIA NOITE
		schedule.scheduleJob('0 0 0 * * *', async () => {
			await this.NodeScheduleServiceProps.InMemoryBlackListService.delAll(
				keysPattern
			)
		})
	}
}
