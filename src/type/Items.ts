export interface Resource {
  resource: string
  quantity: number
}

interface ItemUpgrade {
  aspect: 'quantity' | 'time' | string
  operation: '+' | '/' | '*' | string
  amount: number
  demands?: {[index: string]: number | undefined}
}

export interface Item {
  product: string
  quantity: number
  time: number
  startingActive: number
  demands?: {[index: string]: number | undefined}
  upgrades? : ItemUpgrade[]
}

export interface ItemList { items: Item[]}
