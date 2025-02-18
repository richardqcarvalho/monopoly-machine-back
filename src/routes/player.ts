import { instance, schemas } from '@db'
import { CreatePlayerT, EditPlayerT, PlayerT } from '@typings/player'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const playerRoutes = (server: FastifyInstance) => {
  const getPlayers: RouteHandlerMethod = async (_request, reply) => {
    const players = await instance.select().from(schemas.player)

    return reply.send(players)
  }

  const getPlayer: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as PlayerT
    const [player] = await instance
      .select()
      .from(schemas.player)
      .where(eq(schemas.player.id, playerId))

    return reply.send(player)
  }

  const login: RouteHandlerMethod = async (request, reply) => {
    const { name, password } = request.body as CreatePlayerT
    const [player] = await instance
      .select()
      .from(schemas.player)
      .where(eq(schemas.player.name, name))

    if (player.password === password) return reply.send(player)
    else return reply.status(401).send()
  }

  const createPlayer: RouteHandlerMethod = async (request, reply) => {
    const { name, password } = request.body as CreatePlayerT

    const [player] = await instance
      .select()
      .from(schemas.player)
      .where(eq(schemas.player.name, name))

    if (player) return reply.status(409).send()
    else {
      await instance.insert(schemas.player).values({
        name,
        password,
      })

      return reply.send()
    }
  }

  const editPlayer: RouteHandlerMethod = async (request, reply) => {
    const { name, password } = request.body as EditPlayerT
    const { playerId } = request.params as PlayerT

    const [player] = await instance
      .update(schemas.player)
      .set({
        ...(name && { name }),
        ...(password && { password }),
      })
      .where(eq(schemas.player.id, playerId))
      .returning()

    return reply.send(player)
  }

  const deletePlayer: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as PlayerT

    const [player] = await instance
      .delete(schemas.player)
      .where(eq(schemas.player.id, playerId))
      .returning()

    return reply.send(player)
  }

  return server
    .get('/players', getPlayers)
    .get('/player/:playerId', getPlayer)
    .post('/login', login)
    .post('/player', createPlayer)
    .put('/player/:playerId', editPlayer)
    .delete('/player/:playerId', deletePlayer)
}
