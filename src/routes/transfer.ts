import { db } from '@db'
import { transfersTable } from '@db/schema'
import { RoomT } from '@type/room'
import { CreateTransferT } from '@type/transfer'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'

export const transferRoutes = (server: FastifyInstance) =>
	server
		.get('/transfers', async (_request, reply) => {
			const transfers = await db.select().from(transfersTable)

			return reply.send(transfers)
		})
		.get('/transfers/:roomId', async (request, reply) => {
			const { roomId } = request.params as RoomT
			const transfers = await db
				.select()
				.from(transfersTable)
				.where(eq(transfersTable.room, roomId))

			return reply.send(transfers)
		})
		.post('/transfers/:roomId', async (request, reply) => {
			const { roomId } = request.params as RoomT
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
		})
