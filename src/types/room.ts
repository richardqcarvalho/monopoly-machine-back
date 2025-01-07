export type GetRoomT = {
	roomId: string
}

export type CreateRoomT = {
	playerId: string
}

export type EditRoomT = {
	players?: string[]
	banker?: string
}
