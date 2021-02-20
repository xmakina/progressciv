import { ProductionList, SingleUpgrade, Store, Supply, Upgrade } from '../component'
import { IResourceList } from '../type'
import { Entity, getComponent, HasComponent, ISystem } from '../utils'

const DemandsMet = (requirements: {[index: string]: number}, s: Store): boolean =>
  Object.keys(requirements)
    .reduce<boolean>((acc, k) => acc && requirements[k] <= s.stocks[k], true)

const ConsumeDemands = (requirements: {[index: string]: number}, s: Store): void => {
  Object.keys(requirements).forEach((k) => {
    s.stocks[k] -= requirements[k]
  })
}

const ApplyOperation = (operation: '+' | '/' | '*', amount: number, startingValue: number): number => {
  switch (operation) {
    case '+':
      return startingValue + amount
    case '/':
      return startingValue / amount
    case '*':
      return startingValue * amount
  }
}

const UpgradeQuantity = (u: SingleUpgrade, s: Supply): void => {
  s.product.quantity = ApplyOperation(u.operation, u.amount, s.product.quantity)
  s.store.capacities[s.product.resource] = s.product.quantity
}

const UpgradeTime = (u: SingleUpgrade, p: ProductionList): void => {
  p.productionTime = ApplyOperation(u.operation, u.amount, p.productionTime)
  p.productions.forEach((pr) => { pr.productionTime = ApplyOperation(u.operation, u.amount, pr.productionTime) })
}

const UpgradeCapacity = (u: SingleUpgrade, resource: string, capacities: IResourceList): void => {
  capacities[resource] = ApplyOperation(u.operation, u.amount, capacities[resource] ?? 0)
}

const UpgradeProduction = (u: SingleUpgrade, p: ProductionList): void => {
  p.maximumActive = ApplyOperation(u.operation, u.amount, p.maximumActive)
}

const ApplyUpgrade = (e: Entity, u: SingleUpgrade, store: Store): void => {
  u.requested = false
  switch (u.aspect) {
    case 'quantity':
      return UpgradeQuantity(u, getComponent(e, Supply))
    case 'time':
      return UpgradeTime(u, getComponent(e, ProductionList))
    case 'capacity':
      return UpgradeCapacity(u, getComponent(e, Supply).product.resource, store.capacities)
    case 'production':
      return UpgradeProduction(u, getComponent(e, ProductionList))
  }
}

export class UpgradeSystem implements ISystem {
  public update (_: number, entities: Entity[]): void {
    const store = entities.filter(HasComponent(Store)).map((e) => getComponent(e, Store))[0]

    const upgradeEntities = entities
      .filter(HasComponent(Upgrade))

    upgradeEntities.forEach((e) => {
      getComponent(e, Upgrade).upgrades
        .reduce<SingleUpgrade[]>((acc, u) => acc.concat(u), [])
        .filter((u) => u)
        .filter((u) => u.requested)
        .forEach((u) => {
          if (DemandsMet(u.demands, store)) {
            ApplyUpgrade(e, u, store)
            ConsumeDemands(u.demands, store)
          }
        })
    }
    )
  }
}
