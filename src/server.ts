import { json } from 'express'
import { server, app, httpServer } from '@/index'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

;(async () => {
  const PORT = process.env.PORT || 4000
  await server.start()
  app.use('/graphql', cors<cors.CorsRequest>(), json(), expressMiddleware(server))

  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`)
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`)
  })
})()
