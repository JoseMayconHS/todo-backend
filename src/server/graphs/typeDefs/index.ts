import { gql } from 'apollo-server'

import { UserTypeDefs } from './Users'

export default gql`
	type Query {
		olamundo: String
	}

	${UserTypeDefs}
`
