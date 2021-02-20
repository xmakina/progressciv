import { Entity } from './entity'

export type TickInfo = number

export interface ISystem {
  update: (delta: TickInfo, entities: Entity[], context?: any) => void
}
