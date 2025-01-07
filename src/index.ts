import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { createPlayer, getPlayer, getPlayers } from './routes/player.js'
import {
	createRoom,
	deleteRoom,
	editRoom,
	getRoom,
	getRooms,
} from './routes/room.js'

fastify()
	.register(fastifyCors, { origin: '*' })
	.get('/rooms', getRooms)
	.get('/room/:roomId', getRoom)
	.post('/room/:playerId', createRoom)
	.put('/room/:roomId', editRoom)
	.delete('/room/:roomId', deleteRoom)
	.get('/players', getPlayers)
	.get('/player/:playerId', getPlayer)
	.post('/player', createPlayer)
	.listen({
		port: 4000,
		host: '0.0.0.0',
	})
	.then(address => console.log(`\nServer running on ${address}`))
