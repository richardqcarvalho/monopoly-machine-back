import { boolean, integer, pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const playersTable = pgTable('players', {
	id: uuid().primaryKey().unique().notNull(),
	name: varchar().notNull(),
	amount: integer().notNull(),
	banker: boolean().notNull(),
})

export const transfersTable = pgTable('transfers', {
	id: uuid().primaryKey().unique().notNull(),
	sender: uuid().notNull(),
	receiver: uuid().notNull(),
	amount: integer().notNull(),
})
