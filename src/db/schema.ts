import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const playersTable = pgTable('players', {
	id: uuid().primaryKey().unique().defaultRandom(),
	name: varchar().notNull().unique(),
})

export const roomsTable = pgTable('rooms', {
	id: uuid().primaryKey().unique().defaultRandom(),
	players: uuid()
		.array()
		.notNull()
		.references(() => playersTable.id),
	banker: uuid()
		.notNull()
		.references(() => playersTable.id),
})

export const transfersTable = pgTable('transfers', {
	id: uuid().primaryKey().unique().defaultRandom(),
	from: uuid()
		.notNull()
		.references(() => playersTable.id),
	to: uuid()
		.notNull()
		.references(() => playersTable.id),
	amount: integer().notNull(),
	room: uuid()
		.notNull()
		.unique()
		.references(() => roomsTable.id),
})
