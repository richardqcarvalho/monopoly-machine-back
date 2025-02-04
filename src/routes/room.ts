import { db } from '@db'
import { roomsTable, transfersTable } from '@db/schema'
import { CreateRoomT, EditRoomT, GetRoomT, RoomT } from '@type/room'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'

export const roomRoutes = (server: FastifyInstance) =>
  server
    .get('/rooms', async (_request, reply) => {
      const rooms = await db.select().from(roomsTable)

      return reply.send(rooms)
    })
    .get('/room/:roomId', async (request, reply) => {
      const { roomId } = request.params as RoomT
      const [room] = await db
        .select()
        .from(roomsTable)
        .where(eq(roomsTable.id, roomId))

      return reply.send(room)
    })
    .post('/room/:playerId', async (request, reply) => {
      const { playerId } = request.params as GetRoomT
      const { name, password } = request.body as CreateRoomT
      const [room] = await db
        .insert(roomsTable)
        .values({
          name,
          ...(password && { password }),
          banker: playerId,
          players: [playerId],
        })
        .returning()

      return reply.send(room)
    })
    .put('/room/:roomId', async (request, reply) => {
      const { roomId } = request.params as RoomT
      const { name, password, players, banker } = request.body as EditRoomT

      const [room] = await db
        .update(roomsTable)
        .set({
          ...(name && { name }),
          ...(password && { password }),
          ...(players && { players }),
          ...(banker && { banker }),
        })
        .where(eq(roomsTable.id, roomId))
        .returning()

      return reply.send(room)
    })
    .delete('/room/:roomId', async (request, reply) => {
      const { roomId } = request.params as RoomT

      const transfers = await db
        .delete(transfersTable)
        .where(eq(transfersTable.room, roomId))
        .returning()

      const [room] = await db
        .delete(roomsTable)
        .where(eq(roomsTable.id, roomId))
        .returning()

      return reply.send({ room, transfers })
    })
