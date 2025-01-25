import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import {
	createPlayer,
	deletePlayer,
	editPlayer,
	getPlayerById,
	getPlayers,
	login,
} from './routes/player.js'
import {
	createRoom,
	deleteRoom,
	editRoom,
	getRoomById,
	getRooms,
} from './routes/room.js'
import {
	createTransfer,
	getTransfers,
	getTransfersByRoomId,
} from './routes/transfer.js'

fastify()
	.register(fastifyCors, { origin: '*' })
	.get('/rooms', getRooms)
	.get('/room/:roomId', getRoomById)
	.post('/room/:playerId', createRoom)
	.put('/room/:roomId', editRoom)
	.delete('/room/:roomId', deleteRoom)
	.get('/players', getPlayers)
	.get('/player/:playerId', getPlayerById)
	.post('/login', login)
	.post('/player', createPlayer)
	.put('/player/:playerId', editPlayer)
	.delete('/player/:playerId', deletePlayer)
	.get('/transfers', getTransfers)
	.get('/transfers/:roomId', getTransfersByRoomId)
	.post('/transfers/:roomId', createTransfer)
	.listen({
		port: 4000,
		host: '0.0.0.0',
	})
	.then(address => console.log(`\nServer running on ${address}`))
