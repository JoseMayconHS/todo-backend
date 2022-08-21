import dotenv from 'dotenv'
dotenv.config()

import { ApolloServer } from 'apollo-server'

import { Mongo, MongoService } from '@services/db/mongo'
import { RedisService } from '@services/InMemoryService/Redis/RedisService'
import { NodeScheduleService } from '@services/ScheduleService/NodeSchedule/NodeScheduleService'

import { contextFactory } from './config/context'
import resolvers from './graphs/resolvers'
import typeDefs from './graphs/typeDefs'

const redisService = new RedisService(RedisService.db.tokens)
const nodeScheduleService = new NodeScheduleService({
	InMemoryBlackListService: redisService,
})

type AppProps = {
	PORT?: number
	db: Mongo
}

class App {
	private server: ApolloServer

	constructor({ PORT = +process.env.PORT, db }: AppProps) {
		const context = contextFactory({ db, redis: redisService })

		this.server = new ApolloServer({
			resolvers,
			typeDefs,
			context,
		})

		nodeScheduleService.cleanBlacklist(RedisService.keys.tokens)

		this.server.listen(PORT).then(({ url }) => console.log(url))
	}
}

new MongoService((db: Mongo) => new App({ db }))
