import { eq } from 'drizzle-orm'
import { RouteHandlerMethod } from 'fastify'
import db from '../db/index.js'
import { playersTable } from '../db/schema.js'
import { CreatePlayerT, GetPlayerT } from '../types/player.js'

export const getPlayers: RouteHandlerMethod = async (_request, reply) => {
	const players = await db.select().from(playersTable)

	return reply.send(players)
}

export const getPlayerById: RouteHandlerMethod = async (request, reply) => {
	const { playerId } = request.params as GetPlayerT
	const [player] = await db
		.select()
		.from(playersTable)
		.where(eq(playersTable.id, playerId))

	return reply.send(player)
}

export const createPlayer: RouteHandlerMethod = async (request, reply) => {
	const { name } = request.body as CreatePlayerT
	const [player] = await db
		.insert(playersTable)
		.values({
			name,
		})
		.returning()

	return reply.send(player)
}

export const editPlayer: RouteHandlerMethod = async (request, reply) => {
	const { name } = request.body as CreatePlayerT
	const { playerId } = request.params as GetPlayerT

	const [player] = await db
		.update(playersTable)
		.set({
			name,
		})
		.where(eq(playersTable.id, playerId))
		.returning()

	return reply.send(player)
}

export const deletePlayer: RouteHandlerMethod = async (request, reply) => {
	const { playerId } = request.params as GetPlayerT

	const [player] = await db
		.delete(playersTable)
		.where(eq(playersTable.id, playerId))
		.returning()

	return reply.send(player)
}
