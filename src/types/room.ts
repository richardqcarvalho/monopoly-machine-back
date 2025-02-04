export type RoomT = {
	roomId: string
}

export type GetRoomT = {
	playerId: string
}

export type CreateRoomT = {
	name: string
	password?: string
}

export type EditRoomT = {
	name?: string
	password?: string
	players?: string[]
	banker?: string
}
