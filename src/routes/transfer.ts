import { eq } from 'drizzle-orm'
import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { transfersTable } from '../db/schema.js'
import { GetRoomT } from '../types/room.js'

export const getTransfers: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT
	const transfers = await db
		.select()
		.from(transfersTable)
		.where(eq(transfersTable.room, roomId))

	return reply.send(transfers)
}
