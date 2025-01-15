import { eq } from 'drizzle-orm'
import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { transfersTable } from '../db/schema.js'
import { GetRoomT } from '../types/room.js'
import { CreateTransferT } from '../types/transfer.js'

export const getTransfers: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT
	const transfers = await db
		.select()
		.from(transfersTable)
		.where(eq(transfersTable.room, roomId))

	return reply.send(transfers)
}

export const createTransfer: RouteHandlerMethod = async (request, reply) => {
	const { roomId } = request.params as GetRoomT
	const { amount, from, to } = request.body as CreateTransferT
	const [transfer] = await db
		.insert(transfersTable)
		.values({
			amount,
			from,
			to,
			room: roomId,
		})
		.returning()

	return reply.send(transfer)
}
