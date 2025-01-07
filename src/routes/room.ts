import { eq } from 'drizzle-orm'
import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { roomsTable } from '../db/schema.js'
import { CreateRoomT, GetRoomT } from '../types/room.js'

export const getRooms: RouteHandlerMethod = async (_request, reply) => {
	const rooms = await db.select().from(roomsTable)

	return reply.send(rooms)
}

export const getRoom: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT
	const [room] = await db
		.select()
		.from(roomsTable)
		.where(eq(roomsTable.id, roomId))

	return reply.send(room)
}

export const createRoom: RouteHandlerMethod = async (request, reply) => {
	const { playerId } = request.params as CreateRoomT
	const [room] = await db
		.insert(roomsTable)
		.values({
			banker: playerId,
			players: [playerId],
		})
		.returning()

	return reply.send(room)
}
