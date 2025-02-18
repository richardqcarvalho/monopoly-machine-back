import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

export const playerSchema = pgTable('players', {
  id: uuid().primaryKey().unique().defaultRandom(),
  name: varchar().notNull().unique(),
  password: varchar().notNull(),
})
