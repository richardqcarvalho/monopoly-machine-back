import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const playersTable = pgTable('players', {
	id: uuid().primaryKey().unique().defaultRandom(),
	name: varchar().notNull().unique(),
})

export const roomsTable = pgTable('rooms', {
	id: uuid().primaryKey().unique().defaultRandom(),
	players: uuid().array(),
	banker: uuid().notNull(),
})

export const transfersTable = pgTable('transfers', {
	id: uuid().primaryKey().unique().defaultRandom(),
	from: uuid().notNull(),
	to: uuid().notNull(),
	amount: integer().notNull(),
	room: uuid().notNull().unique(),
})
