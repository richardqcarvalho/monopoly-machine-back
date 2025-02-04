import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { playerRoutes } from './routes/player.js'
import { roomRoutes } from './routes/room.js'
import { transferRoutes } from './routes/transfer.js'

const startServer = async () => {
  const server = fastify()
    .register(fastifyCors, { origin: '*' })
    .register(playerRoutes)
    .register(roomRoutes)
    .register(transferRoutes)

  const address = await server.listen({
    port: 4000,
    host: '0.0.0.0',
  })

  console.log(`\nServer running on ${address}`)
}

startServer()
