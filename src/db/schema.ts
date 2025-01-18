import { integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const playersTable = pgTable('players', {
	id: uuid().primaryKey().unique().defaultRandom(),
	name: varchar().notNull().unique(),
})

export const roomsTable = pgTable('rooms', {
	id: uuid().primaryKey().unique().defaultRandom(),
	name: varchar().notNull().unique(),
	password: varchar(),
	players: uuid()
		.references(() => playersTable.id)
		.array()
		.notNull(),
	banker: uuid()
		.notNull()
		.references(() => playersTable.id),
})

export const transfersTable = pgTable('transfers', {
	id: uuid().primaryKey().unique().defaultRandom(),
	from: uuid()
		.references(() => playersTable.id)
		.notNull(),
	to: uuid()
		.references(() => playersTable.id)
		.notNull(),
	amount: integer().notNull(),
	room: uuid()
		.references(() => roomsTable.id)
		.unique()
		.notNull(),
})
