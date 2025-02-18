import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'
import { playerSchema as player } from './player'

export const roomSchema = pgTable('rooms', {
  id: uuid().primaryKey().unique().defaultRandom(),
  name: varchar().notNull().unique(),
  password: varchar(),
  players: uuid()
    .references(() => player.id)
    .array()
    .notNull(),
  banker: uuid()
    .notNull()
    .references(() => player.id),
})
