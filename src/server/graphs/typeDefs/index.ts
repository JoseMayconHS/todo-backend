import { gql } from 'apollo-server'

import { UserTypeDefs } from './Users'

export default gql`
	${UserTypeDefs}
`
