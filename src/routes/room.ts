import { eq } from 'drizzle-orm'
import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { roomsTable, transfersTable } from '../db/schema.js'
import { CreateRoomT, EditRoomT, GetRoomT } from '../types/room.js'

export const getRooms: RouteHandlerMethod = async (_request, reply) => {
	const rooms = await db.select().from(roomsTable)

	return reply.send(rooms)
}

export const getRoomById: RouteHandlerMethod = async (request, reply) => {
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

export const editRoom: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT
	const { players, banker } = request.body as EditRoomT

	const [room] = await db
		.update(roomsTable)
		.set({
			...(players && { players }),
			...(banker && { banker }),
		})
		.where(eq(roomsTable.id, roomId))
		.returning()

	return reply.send(room)
}

export const deleteRoom: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT

	const transfers = await db
		.delete(transfersTable)
		.where(eq(transfersTable.room, roomId))
		.returning()

	const [room] = await db
		.delete(roomsTable)
		.where(eq(roomsTable.id, roomId))
		.returning()

	return reply.send({ room, transfers })
}
