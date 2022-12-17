import express from 'express'
import { ApolloServer } from '@apollo/server'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { useServer } from 'graphql-ws/lib/use/ws'
import { typeDefs } from '@/graphql/typeDefs'
import { resolvers } from '@/graphql/resolvers'
import { Disposable } from 'graphql-ws'
import { GraphQLSchema } from 'graphql'

export const app = express()
export const httpServer = createServer(app)
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
})
const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers })
const serverCleanup: Disposable = useServer(
  {
    schema,
    context: async (_ctx, __msg, _args) => {
      return {}
    }
  },
  wsServer
)

export const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          }
        }
      }
    }
  ]
})
