import { ApolloServer } from 'apollo-server'
import dotenv from 'dotenv'

import { Mongo, MongoDB } from '@services/db/mongo'

import { contextFactory } from './config/context'
import resolvers from './graphs/resolvers'
import typeDefs from './graphs/typeDefs'

dotenv.config()

type AppProps = {
	PORT?: number
	db: MongoDB
}

class App {
	private server: ApolloServer

	constructor({ PORT = +process.env.PORT, db }: AppProps) {
		const context = contextFactory(db)

		this.server = new ApolloServer({
			resolvers,
			typeDefs,
			context,
		})

		this.server.listen(PORT).then(({ url }) => console.log(url))
	}
}

new Mongo((db: MongoDB) => new App({ db }))
