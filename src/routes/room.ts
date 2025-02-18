import { instance, schemas } from '@db'
import { CreateRoomT, EditRoomT, GetRoomT, RoomT } from '@typings/room'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const roomRoutes = (server: FastifyInstance) => {
  const getRooms: RouteHandlerMethod = async (_request, reply) => {
    const rooms = await instance.select().from(schemas.room)

    return reply.send(rooms)
  }

  const getRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const [room] = await instance
      .select()
      .from(schemas.room)
      .where(eq(schemas.room.id, roomId))

    return reply.send(room)
  }

  const createRoom: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as GetRoomT
    const { name, password } = request.body as CreateRoomT
    const [room] = await instance
      .insert(schemas.room)
      .values({
        name,
        ...(password && { password }),
        banker: playerId,
        players: [playerId],
      })
      .returning()

    return reply.send(room)
  }

  const editRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const { name, password, players, banker } = request.body as EditRoomT

    const [room] = await instance
      .update(schemas.room)
      .set({
        ...(name && { name }),
        ...(password && { password }),
        ...(players && { players }),
        ...(banker && { banker }),
      })
      .where(eq(schemas.room.id, roomId))
      .returning()

    return reply.send(room)
  }

  const deleteRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT

    const transfers = await instance
      .delete(schemas.transfer)
      .where(eq(schemas.transfer.room, roomId))
      .returning()

    const [room] = await instance
      .delete(schemas.room)
      .where(eq(schemas.room.id, roomId))
      .returning()

    return reply.send({ room, transfers })
  }

  return server
    .get('/rooms', getRooms)
    .get('/room/:roomId', getRoom)
    .post('/room/:playerId', createRoom)
    .put('/room/:roomId', editRoom)
    .delete('/room/:roomId', deleteRoom)
}
