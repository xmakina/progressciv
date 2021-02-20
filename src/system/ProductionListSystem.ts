import { Demand, Production, ProductionList } from '../component'
import { Entity, getComponent, hasComponent, HasComponent, ISystem, TickInfo } from '../utils'

const DemandMet = (e: Entity): boolean => {
  if (hasComponent(e, Demand)) {
    const d = getComponent(e, Demand)
    if (d.met && d.working) {
      d.consumed = true
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}

export class ProductionListSystem implements ISystem {
  public updateComponent (tickInfo: TickInfo, e: Entity, p: Production, index: number, maximum: number): void {
    const HandleConsumed = (): void => {
      if (p.consumed) {
        if (DemandMet(e)) {
          p.progress -= p.productionTime
        } else {
          p.progress = 0
        }

        p.consumed = false
        p.productionComplete = false
      }
    }

    const HandleProgress = (): void => {
      if (!p.productionComplete && p.working) {
        if (p.progress === 0) {
          if (DemandMet(e)) {
            p.progress += tickInfo
          }
        } else {
          p.progress += tickInfo
        }
      }
    }

    const HandleReady = (): void => {
      if (!p.productionComplete) {
        if (p.progress >= p.productionTime) {
          p.productionComplete = true
        }
      }
    }

    HandleConsumed()
    HandleProgress()
    HandleReady()
  }

  public update (tickInfo: TickInfo, entities: Entity[]): void {
    entities.filter(HasComponent(ProductionList)).forEach((e) => {
      const pl = getComponent(e, ProductionList)
      while (pl.productions.length < pl.maximumActive) {
        pl.productions.push(new Production({ productionTime: pl.productionTime }))
      }

      pl.productions.forEach((p, index) => {
        this.updateComponent(tickInfo, e, p, index, pl.currentActive)
      })
    })
  }
}
