import { Store, Supply } from '../component'
import { Entity, getComponent, HasComponent, ISystem } from '../utils'

const TransferToStorage = (s: Supply, store: Store): void => {
  const k = s.product.resource
  if (store.capacities[k] > 0 && s.store.stocks[k] > 0) {
    const amount = Math.min(
      (store.capacities[k] ?? 0) - (store.stocks[k] ?? 0),
      (s.store.stocks[k] ?? 0))
    if (amount > 0) {
      store.existed[k] = true
      s.store.stocks[k] = (s.store.stocks[k] ?? 0) - amount
      store.stocks[k] = (store.stocks[k] ?? 0) + amount
    }
  }
}

export class SupplyStorageSystem implements ISystem {
  public update (delta: number, entities: Entity[]): void {
    const store = entities.filter(HasComponent(Store)).map((e) => getComponent(e, Store))[0]
    entities.filter(HasComponent(Supply)).forEach((e) => {
      const s: Supply = getComponent(e, Supply)
      TransferToStorage(s, store)
    })
  }
}
