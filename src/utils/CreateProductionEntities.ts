import { Entity } from '.'
import { Demand, Production, ProductionList, SingleUpgrade, Supply, Upgrade } from '../component'
import { ItemList, Resource } from '../type'

export function CreateProductionEntities (itemList: ItemList): Entity[] {
  const entities = itemList.items.map((item) => {
    const e = new Entity()
    const k = item.product

    const d = new Demand({ demands: item.demands })
    e.components.push(d)

    const p = new ProductionList({ currentActive: item.startingActive, maximumActive: item.startingActive, productionTime: item.time })
    for (let i = 0; i < p.maximumActive; i++) {
      p.productions.push(new Production({ productionTime: item.time }))
    }
    e.components.push(p)

    const product: Resource = { resource: k, quantity: item.quantity }
    const s = new Supply({ product })
    e.components.push(s)

    const upgrades = item.upgrades?.map<SingleUpgrade>((u) => new SingleUpgrade({
      amount: u.amount,
      aspect: u.aspect,
      demands: u.demands,
      operation: u.operation
    })) ?? []

    const upgrade = new Upgrade({ upgrades })
    e.components.push(upgrade)

    return e
  })

  return entities
}
