export type PlayerT = {
  playerId: string
}

export type CreatePlayerT = {
  name: string
  password: string
}

export type EditPlayerT = {
  name?: string
  password?: string
}
