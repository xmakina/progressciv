import { Production, ProductionList, Supply } from '../component'
import { Entity, getComponent, HasComponent, ISystem } from '../utils'

const ConsumeProduction = (s: Supply, p: Production): void => {
  if (!p.consumed) {
    p.consumed = true
    const k = s.product.resource
    s.store.stocks[k] = (s.store.stocks[k] ?? 0) + s.product.quantity
  }
}

const HasSpace = (s: Supply): boolean => {
  const k = s.product.resource
  return (s.store.stocks[k] ?? 0) + s.product.quantity <= (s.store.capacities[k] ?? 0)
}

export class SupplySystem implements ISystem {
  update (_: number, entities: Entity[]): void {
    entities
      .filter(HasComponent(Supply))
      .forEach((e) => {
        const s = getComponent(e, Supply)
        const pl = getComponent(e, ProductionList)

        pl.productions.forEach((p) => {
          if (p.productionComplete && HasSpace(s)) {
            ConsumeProduction(s, p)
          }
        })
      })
  }
}
