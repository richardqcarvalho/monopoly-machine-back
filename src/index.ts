import fastifyCors from '@fastify/cors'
import { playerRoutes } from '@route/player'
import { roomRoutes } from '@route/room'
import { transferRoutes } from '@route/transfer'
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
