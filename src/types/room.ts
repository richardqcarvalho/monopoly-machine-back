export type GetRoomT = {
	roomId: string
}

export type CreateRoomParamsT = {
	playerId: string
}

export type CreateRoomBodyT = {
	name: string
	password?: string
}

export type EditRoomT = {
	name?: string
	password?: string
	players?: string[]
	banker?: string
}
