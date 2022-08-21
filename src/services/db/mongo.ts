import { Collection, Document, MongoClient } from 'mongodb'

export type Mongo = {
	user: Collection<Document>
}

export class MongoService {
	#user: Collection<Document>

	constructor(serverCallback: Function) {
		this.init(serverCallback)
	}

	async init(serverCallback: Function) {
		const client = new MongoClient(process.env.MONGO_URL)

		await client.connect()

		const db = client.db(process.env.MONGO_DBNAME)

		this.#user = db.collection('user')

		serverCallback({
			user: this.User,
		})
	}

	get User() {
		return this.#user
	}
}
