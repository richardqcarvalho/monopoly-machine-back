import fastifyCors from '@fastify/cors'
import { playerRoutes } from '@routes/player'
import { roomRoutes } from '@routes/room'
import { transferRoutes } from '@routes/transfer'
import fastify from 'fastify'

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
