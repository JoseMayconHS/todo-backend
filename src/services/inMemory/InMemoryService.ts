export interface SetItemData {
	key: string
	value: string
}

export interface InMemoryService {
	setItem(data: SetItemData): Promise<void>
	getItem(key: string): Promise<string | null>
	delItem(key: string): Promise<void>
	delAll(keyPattern: string): Promise<void>
}
