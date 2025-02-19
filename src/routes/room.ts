import { instance, schemas } from '@db'
import { PlayersT } from '@typings/player'
import { CreateRoomT, EditRoomT, GetRoomT, RoomT } from '@typings/room'
import { hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const roomRoutes = (server: FastifyInstance) => {
  const getRooms: RouteHandlerMethod = async (_request, reply) => {
    const rooms = await instance
      .select({ id: schemas.room.id, name: schemas.room.name })
      .from(schemas.room)

    return reply.send(rooms)
  }

  const getRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const players: PlayersT = []
    const [room] = await instance
      .select({
        banker: schemas.room.banker,
        players: schemas.room.players,
        name: schemas.room.name,
      })
      .from(schemas.room)
      .where(eq(schemas.room.id, roomId))

    for (const playerId of room.players) {
      const [player] = await instance
        .select({ id: schemas.player.id, name: schemas.player.name })
        .from(schemas.player)
        .where(eq(schemas.player.id, playerId))

      players.push(player)
    }

    return reply.send({ ...room, players })
  }

  const createRoom: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as GetRoomT
    const { name, password } = request.body as CreateRoomT
    const encryptedPassword = password && (await hash(password, 16))

    const [room] = await instance
      .insert(schemas.room)
      .values({
        name,
        ...(encryptedPassword && { password: encryptedPassword }),
        banker: playerId,
        players: [playerId],
      })
      .returning({ id: schemas.room.id })

    const rooms = await instance
      .select({ id: schemas.room.id, name: schemas.room.name })
      .from(schemas.room)

    return reply.send({ roomId: room.id, rooms })
  }

  const editRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT
    const { name, password, players, banker } = request.body as EditRoomT
    const encryptedPassword = password && (await hash(password, 16))

    await instance
      .update(schemas.room)
      .set({
        ...(name && { name }),
        ...(encryptedPassword && { password: encryptedPassword }),
        ...(players && { players }),
        ...(banker && { banker }),
      })
      .where(eq(schemas.room.id, roomId))

    const rooms = await instance
      .select({ name: schemas.room.name })
      .from(schemas.room)

    return reply.send(rooms)
  }

  const deleteRoom: RouteHandlerMethod = async (request, reply) => {
    const { roomId } = request.params as RoomT

    await instance
      .delete(schemas.transfer)
      .where(eq(schemas.transfer.room, roomId))
    await instance.delete(schemas.room).where(eq(schemas.room.id, roomId))

    return reply.send()
  }

  return server
    .get('/rooms', getRooms)
    .get('/room/:roomId', getRoom)
    .post('/room/:playerId', createRoom)
    .put('/room/:roomId', editRoom)
    .delete('/room/:roomId', deleteRoom)
}
