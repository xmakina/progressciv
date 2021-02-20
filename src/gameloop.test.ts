import { Demand, Production, ProductionList, Store, Supply } from './component'
import { DemandSystem, ProductionListSystem, StorageDemandSystem, SupplyStorageSystem, SupplySystem } from './system'
import { Entity } from './utils'

describe('with a full loop', () => {
  let store: Store
  let demand: Demand
  let production: Production
  let productionList: ProductionList
  let supply: Supply

  const RunTest = (updates: number): void => {
    store = new Store({
      stocks: { iron: 1, coal: 1 },
      capacities: { ironplate: 1 }
    })

    const storageDemandSystem: StorageDemandSystem = new StorageDemandSystem()
    const demandSystem: DemandSystem = new DemandSystem()
    const productionSystem: ProductionListSystem = new ProductionListSystem()
    const supplySystem: SupplySystem = new SupplySystem()
    const supplyStorageSystem: SupplyStorageSystem = new SupplyStorageSystem()

    const systems = [storageDemandSystem, demandSystem, productionSystem, supplySystem, supplyStorageSystem]

    demand = new Demand({ demands: { iron: 1, coal: 0.1 }, open: true, working: true })
    production = new Production({ productionTime: 5, working: true })
    productionList = new ProductionList({ productions: [production], currentActive: 1, maximumActive: 1 })
    supply = new Supply({ product: { resource: 'ironplate', quantity: 1 } })

    const machineEntity = new Entity()
    machineEntity.components.push(demand)
    machineEntity.components.push(productionList)
    machineEntity.components.push(supply)

    const storeEntity = new Entity()
    storeEntity.components.push(store)

    for (let i: number = 0; i < updates; i++) {
      systems.forEach((s) => s.update(1, [machineEntity, storeEntity]))
    }
  }

  describe('after 1 update', () => {
    beforeEach(() => {
      RunTest(1)
    })

    test('store has been taken from', () => {
      expect(store.stocks.iron).toEqual(0)
      expect(store.stocks.coal).toEqual(0.9)
    })

    test('demand has been filled', () => {
      expect(demand.store.stocks.iron).toEqual(1)
      expect(demand.store.stocks.coal).toEqual(0.1)
      expect(demand.met).toEqual(true)
    })

    test('demand has been marked for consumption', () => {
      expect(demand.consumed).toEqual(true)
    })

    test('production has started', () => {
      expect(production.progress).toEqual(1)
    })
  })

  describe('after 2 updates', () => {
    beforeEach(() => {
      RunTest(2)
    })

    test('store has been taken from', () => {
      expect(store.stocks.iron).toEqual(0)
      expect(store.stocks.coal).toEqual(0.9)
    })

    test('demand has been consumed', () => {
      expect(demand.store.stocks.iron).toEqual(0)
      expect(demand.store.stocks.coal).toEqual(0)
      expect(demand.met).toEqual(false)
    })

    test('demand has been cleared for consumption', () => {
      expect(demand.consumed).toEqual(false)
    })

    test('production has continued', () => {
      expect(production.progress).toEqual(2)
    })
  })

  describe('after 3 updates', () => {
    beforeEach(() => {
      RunTest(3)
    })

    test('store has been taken from', () => {
      expect(store.stocks.iron).toEqual(0)
      expect(store.stocks.coal).toEqual(0.8)
    })

    test('demand has been added to where possible', () => {
      expect(demand.store.stocks.iron).toEqual(0)
      expect(demand.store.stocks.coal).toEqual(0.1)
      expect(demand.met).toEqual(false)
    })

    test('demand consumption has not been changed', () => {
      expect(demand.consumed).toEqual(false)
    })

    test('production has continued', () => {
      expect(production.progress).toEqual(3)
    })
  })

  describe('after 4 updates', () => {
    beforeEach(() => {
      RunTest(4)
    })

    test('store has not been changed', () => {
      expect(store.stocks.iron).toEqual(0)
      expect(store.stocks.coal).toEqual(0.8)
    })

    test('demand has has not been changed', () => {
      expect(demand.store.stocks.iron).toEqual(0)
      expect(demand.store.stocks.coal).toEqual(0.1)
      expect(demand.met).toEqual(false)
    })

    test('production has continued', () => {
      expect(production.progress).toEqual(4)
    })
  })

  describe('after 5 updates', () => {
    beforeEach(() => {
      RunTest(5)
    })

    test('production has finished', () => {
      expect(production.progress).toEqual(5)
      expect(production.productionComplete).toEqual(true)
    })

    test('production is marked for consumption', () => {
      expect(production.consumed).toEqual(true)
    })

    test('supply has been taken from', () => {
      expect(supply.store.stocks.ironplate).toEqual(0)
    })

    test('store has been added to', () => {
      expect(store.stocks.ironplate).toEqual(1)
    })
  })

  describe('after 6 updates', () => {
    beforeEach(() => {
      RunTest(6)
    })

    test('production has been reset', () => {
      expect(production.progress).toEqual(0)
      expect(production.productionComplete).toEqual(false)
    })

    test('production has been cleared for consumption', () => {
      expect(production.consumed).toEqual(false)
    })

    test('supply has not changed', () => {
      expect(supply.store.stocks.ironplate).toEqual(0)
    })

    test('store has not changed', () => {
      expect(store.stocks.ironplate).toEqual(1)
    })
  })

  describe('after 7 updates', () => {
    beforeEach(() => {
      RunTest(7)
    })

    test('production has not changed', () => {
      expect(production.progress).toEqual(0)
      expect(production.productionComplete).toEqual(false)
    })

    test('production consumption has not changed', () => {
      expect(production.consumed).toEqual(false)
    })
  })
})
