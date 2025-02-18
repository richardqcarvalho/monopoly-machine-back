import { db } from '@db'
import { playersTable } from '@db/schema'
import { CreatePlayerT, EditPlayerT, PlayerT } from '@typings/player'
import { eq } from 'drizzle-orm'
import { FastifyInstance } from 'fastify'

export const playerRoutes = (server: FastifyInstance) =>
  server
    .get('/players', async (_request, reply) => {
      const players = await db.select().from(playersTable)

      return reply.send(players)
    })
    .get('/player/:playerId', async (request, reply) => {
      const { playerId } = request.params as PlayerT
      const [player] = await db
        .select()
        .from(playersTable)
        .where(eq(playersTable.id, playerId))

      return reply.send(player)
    })
    .post('/login', async (request, reply) => {
      const { name, password } = request.body as CreatePlayerT
      const [player] = await db
        .select()
        .from(playersTable)
        .where(eq(playersTable.name, name))

      if (player.password === password) return reply.send(player)
      else return reply.status(401).send()
    })
    .post('/player', async (request, reply) => {
      const { name, password } = request.body as CreatePlayerT

      const [player] = await db
        .select()
        .from(playersTable)
        .where(eq(playersTable.name, name))

      if (player) return reply.status(409).send()
      else {
        await db.insert(playersTable).values({
          name,
          password,
        })

        return reply.send()
      }
    })
    .put('/player/:playerId', async (request, reply) => {
      const { name, password } = request.body as EditPlayerT
      const { playerId } = request.params as PlayerT

      const [player] = await db
        .update(playersTable)
        .set({
          ...(name && { name }),
          ...(password && { password }),
        })
        .where(eq(playersTable.id, playerId))
        .returning()

      return reply.send(player)
    })
    .delete('/player/:playerId', async (request, reply) => {
      const { playerId } = request.params as PlayerT

      const [player] = await db
        .delete(playersTable)
        .where(eq(playersTable.id, playerId))
        .returning()

      return reply.send(player)
    })
