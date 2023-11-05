import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import { Express, json } from 'express'
import { readFileSync } from 'node:fs'
import { IUser } from '../models/user'
import { authenticate } from '../services/authService'
import { resolvers } from './resolvers'

const typeDefs = readFileSync('./src/graphql/schema.graphql', { encoding: 'utf-8' })

export const GraphQLPath = '/graphql'

interface AuthContext {
  currentUser?: IUser
}

export async function useGraphQL(app: Express) {
  const server = new ApolloServer<AuthContext>({
    typeDefs,
    resolvers,
  })

  await server.start()

  app.use(GraphQLPath, authenticate({ authOverridingOperations: ['Login'] }))
  app.use(
    GraphQLPath,
    cors<cors.CorsRequest>(),
    json(),
    expressMiddleware(server, {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      context: async ({ req, res }) => ({
        currentUser: res.locals.currentUser as IUser,
      }),
    })
  )
}
