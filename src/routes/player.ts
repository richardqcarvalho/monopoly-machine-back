import { instance, schemas } from '@db'
import { CreatePlayerT, EditPlayerT, PlayerT } from '@typings/player'
import { compare, hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { FastifyInstance, RouteHandlerMethod } from 'fastify'

export const playerRoutes = (server: FastifyInstance) => {
  const getPlayer: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as PlayerT
    const [player] = await instance
      .select({ id: schemas.player.id, name: schemas.player.name })
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
    const passwordMatch = await compare(player.password, password)

    if (passwordMatch) return reply.send({ id: player.id, name: player.name })
    else return reply.status(401).send()
  }

  const createPlayer: RouteHandlerMethod = async (request, reply) => {
    const { name, password } = request.body as CreatePlayerT

    const [player] = await instance
      .select({ id: schemas.player.id })
      .from(schemas.player)
      .where(eq(schemas.player.name, name))

    if (player) return reply.status(409).send()
    else {
      const encryptedPassword = await hash(password, 16)
      await instance.insert(schemas.player).values({
        name,
        password: encryptedPassword,
      })

      return reply.send()
    }
  }

  const editPlayer: RouteHandlerMethod = async (request, reply) => {
    const { name, password } = request.body as EditPlayerT
    const { playerId } = request.params as PlayerT
    const encryptedPassword = password && (await hash(password, 16))

    const [player] = await instance
      .update(schemas.player)
      .set({
        ...(name && { name }),
        ...(encryptedPassword && { password: encryptedPassword }),
      })
      .where(eq(schemas.player.id, playerId))
      .returning({ name: schemas.player.name })

    return reply.send(player)
  }

  const deletePlayer: RouteHandlerMethod = async (request, reply) => {
    const { playerId } = request.params as PlayerT

    await instance.delete(schemas.player).where(eq(schemas.player.id, playerId))

    return reply.send()
  }

  return server
    .get('/player/:playerId', getPlayer)
    .post('/login', login)
    .post('/player', createPlayer)
    .put('/player/:playerId', editPlayer)
    .delete('/player/:playerId', deletePlayer)
}
