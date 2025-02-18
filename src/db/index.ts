import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { playerSchema } from './schemas/player'
import { roomSchema } from './schemas/room'
import { transferSchema } from './schemas/transfer'

export const instance = drizzle(process.env.DATABASE_URL!)

export const schemas = {
  player: playerSchema,
  room: roomSchema,
  transfer: transferSchema,
}
