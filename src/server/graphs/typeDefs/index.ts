import { gql } from 'apollo-server'

import { UserTypeDefs } from './Users'

/**
 * (END) CRIAR DEFINIÇÕES DE TIPOS DE WORKSPACE
 */

export default gql`
	${UserTypeDefs}
`
