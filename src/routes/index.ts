import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { playersTable } from '../db/schema.js'

export const getPlayers: RouteHandlerMethod = async (request, reply) => {
	const players = await db.select().from(playersTable)

	return reply.send(players)
}
