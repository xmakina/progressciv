import { Entity, getComponent, HasComponent, ISystem, TickInfo } from '../utils'
import { Demand, Store } from '../component'

export const TransferToDemand = (d: Demand, s: Store): void => {
  const transferAmount = (resource: string): number =>
    Math.min(
      s.stocks[resource] ?? 0,
      (d.store.capacities[resource] ?? 0) - (d.store.stocks[resource] ?? 0)
    )

  Object.keys(d.demands).forEach((k) => {
    const amount = transferAmount(k)
    if (amount > 0) {
      s.stocks[k] = (s.stocks[k] ?? 0) - amount
      d.store.stocks[k] = (d.store.stocks[k] ?? 0) + amount
    }
  })
}

export class StorageDemandSystem implements ISystem {
  public update (tickInfo: TickInfo, entities: Entity[]): void {
    const store = entities.filter(HasComponent(Store)).map((e) => getComponent(e, Store))[0]

    entities
      .filter(HasComponent(Demand))
      .map((e) => getComponent(e, Demand))
      .forEach((d) => {
        if (d.open) {
          TransferToDemand(d, store)
        }
      })
  }
}
