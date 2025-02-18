import { instance, schemas } from '@db'
import { RoomT } from '@typings/room'
import { CreateTransferT } from '@typings/transfer'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const transferRoutes = (server: FastifyInstance) => {
  const getTransfers: RouteHandlerMethod = async (_request, reply) => {
    const transfers = await instance.select().from(schemas.transfer)

    return reply.send(transfers)
  }

  const getTransfer: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const transfers = await instance
      .select()
      .from(schemas.transfer)
      .where(eq(schemas.transfer.room, roomId))

    return reply.send(transfers)
  }

  const createTransfer: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const { amount, from, to } = request.body as CreateTransferT
    const [transfer] = await instance
      .insert(schemas.transfer)
      .values({
        amount,
        from,
        to,
        room: roomId,
      })
      .returning()

    return reply.send(transfer)
  }

  return server
    .get('/transfers', getTransfers)
    .get('/transfers/:roomId', getTransfer)
    .post('/transfers/:roomId', createTransfer)
}
