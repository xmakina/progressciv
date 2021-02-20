import { Demand } from '../component'
import { Entity, getComponent, HasComponent, ISystem } from '../utils'

const DemandsMet = (d: Demand): boolean =>
  Object.keys(d.demands)
    .reduce<boolean>((acc, k) => acc && d.demands[k] <= d.store.stocks[k], true)

const ConsumeDemands = (d: Demand): void => {
  Object.keys(d.demands).forEach((k) => {
    d.store.stocks[k] -= d.demands[k]
  })

  d.consumed = false
}

export class DemandSystem implements ISystem {
  update (delta: number, entities: Entity[]): void {
    entities.filter(HasComponent(Demand)).forEach((e) => {
      const d = getComponent(e, Demand)
      this.updateComponent(delta, d)
    })
  }

  updateComponent (delta: number, d: Demand): void {
    if (d.consumed) {
      ConsumeDemands(d)
    }
    d.met = DemandsMet(d)
  }
}
