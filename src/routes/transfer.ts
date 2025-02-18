import { instance, schemas } from '@db'
import { RoomT } from '@typings/room'
import { CreateTransferT } from '@typings/transfer'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const transferRoutes = (server: FastifyInstance) => {
  const getTransfers: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const transfers = await instance
      .select({
        from: schemas.transfer.from,
        to: schemas.transfer.to,
        amount: schemas.transfer.amount,
      })
      .from(schemas.transfer)
      .where(eq(schemas.transfer.room, roomId))

    return reply.send(transfers)
  }

  const createTransfer: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const { amount, from, to } = request.body as CreateTransferT

    await instance.insert(schemas.transfer).values({
      amount,
      from,
      to,
      room: roomId,
    })

    const transfers = await instance
      .select({
        from: schemas.transfer.from,
        to: schemas.transfer.to,
        amount: schemas.transfer.amount,
      })
      .from(schemas.transfer)
      .where(eq(schemas.transfer.room, roomId))

    return reply.send(transfers)
  }

  return server
    .get('/transfers/:roomId', getTransfers)
    .post('/transfers/:roomId', createTransfer)
}
