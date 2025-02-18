import { integer, pgTable, uuid } from 'drizzle-orm/pg-core'
import { playerSchema as player } from './player'
import { roomSchema as room } from './room'

export const transferSchema = pgTable('transfers', {
  id: uuid().primaryKey().unique().defaultRandom(),
  from: uuid()
    .references(() => player.id)
    .notNull(),
  to: uuid()
    .references(() => player.id)
    .notNull(),
  amount: integer().notNull(),
  room: uuid()
    .references(() => room.id)
    .unique()
    .notNull(),
})
