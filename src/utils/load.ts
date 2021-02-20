import { Entity } from '.'
import { Demand, ProductionList, Store, Supply, Display } from '../component'

export function Load (state: string): Entity[] {
  return JSON.parse(state).map((e: Entity) => {
    e.components = e.components.map((c) => {
      switch (c.type) {
        case 'Demand':
          return new Demand((c as Demand))
        case 'ProductionList':
          return new ProductionList((c as ProductionList))
        case 'Store':
          return new Store((c as Store))
        case 'Supply':
          return new Supply((c as Supply))
        case 'Display':
          return new Display((c as Display))
        default:
          throw new Error(`${c.type} is not supported`)
      }
    })

    return e
  })
}
