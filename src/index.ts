import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { getPlayers } from './routes/index.js'

fastify()
	.register(fastifyCors, { origin: '*' })
	.get('/players', getPlayers)
	.listen({
		port: 4000,
		host: '0.0.0.0',
	})
	.then(address => console.log(`Server running on ${address}`))
