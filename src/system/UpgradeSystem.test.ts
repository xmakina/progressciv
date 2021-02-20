import { Production, ProductionList, SingleUpgrade, Store, Supply, Upgrade } from '../component'
import { Entity } from '../utils'
import { UpgradeSystem } from './UpgradeSystem'

describe('with upgrade system', () => {
  let production: Production
  let productionList: ProductionList
  let supply: Supply
  let timeUpgrade: SingleUpgrade
  let quantityUpgrade: SingleUpgrade
  let store: Store

  beforeEach(() => {
    production = new Production({ productionTime: 1000 })
    productionList = new ProductionList({ productions: [production] })
    supply = new Supply({ product: { resource: 'wood', quantity: 2 } })
  })

  const RunTest = (): void => {
    const upgrade = new Upgrade({ upgrades: [timeUpgrade, quantityUpgrade] })

    const entity = new Entity()
    entity.components.push(productionList)
    entity.components.push(supply)
    entity.components.push(upgrade)

    const storeEntity = new Entity()
    storeEntity.components.push(store)

    const system = new UpgradeSystem()
    system.update(0, [entity, storeEntity])
  }

  describe('when upgrade has been requested', () => {
    describe('when the upgrade increases quantity +2', () => {
      beforeEach(() => {
        supply = new Supply({ product: { resource: 'wood', quantity: 2 } })
        quantityUpgrade = new SingleUpgrade({ aspect: 'quantity', operation: '+', amount: 2, requested: true })
        RunTest()
      })

      test('the quantity upgrade is applied', () => {
        expect(supply.product.quantity).toEqual(4)
      })

      test('the internal storage matches the quantity', () => {
        expect(supply.store.capacities.wood).toEqual(4)
      })

      test('the upgrade is no longer requested', () => {
        expect(quantityUpgrade.requested).toEqual(false)
      })
    })

    describe('when the upgrade increases capacity +100', () => {
      beforeEach(() => {
        store = new Store({ capacities: { wood: 100 } })
        quantityUpgrade = new SingleUpgrade({ aspect: 'capacity', operation: '+', amount: 100, requested: true })
        RunTest()
      })

      test('the upgrade is applied', () => {
        expect(store.capacities.wood).toEqual(200)
      })

      test('the upgrade is no longer requested', () => {
        expect(quantityUpgrade.requested).toEqual(false)
      })
    })

    describe('when the upgrade decreases time by * 0.5', () => {
      beforeEach(() => {
        production = new Production({ productionTime: 1000 })
        productionList = new ProductionList({ productions: [production] })
        timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '*', amount: 0.5, requested: true })
        RunTest()
      })

      test('the upgrade is applied', () => {
        expect(production.productionTime).toEqual(500)
      })
      test('the upgrade is no longer requested', () => {
        expect(quantityUpgrade.requested).toEqual(false)
      })
    })

    describe('when the upgrade decreases time by * 0.95', () => {
      beforeEach(() => {
        production = new Production({ productionTime: 1000 })
        productionList = new ProductionList({ productions: [production] })
        timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '*', amount: 0.95, requested: true })
        RunTest()
      })

      test('the upgrade is applied', () => {
        expect(production.productionTime).toEqual(950)
      })

      test('the upgrade is no longer requested', () => {
        expect(quantityUpgrade.requested).toEqual(false)
      })
    })

    describe('when the upgrade decreases time by / 1.25', () => {
      beforeEach(() => {
        production = new Production({ productionTime: 1000 })
        productionList = new ProductionList({ productions: [production] })
        timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '/', amount: 1.25, requested: true })
        RunTest()
      })

      test('the upgrade is applied', () => {
        expect(production.productionTime).toEqual(800)
      })
      test('the upgrade is no longer requested', () => {
        expect(quantityUpgrade.requested).toEqual(false)
      })
    })
  })

  describe('when upgrade has not been requested', () => {
    beforeEach(() => {
      production = new Production({ productionTime: 1000 })
      productionList = new ProductionList({ productions: [production] })
      timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '*', amount: 0.5, requested: false, demands: { wood: 1 } })
      store = new Store({ stocks: { wood: 1 } })
      RunTest()
    })

    test('the upgrade is not applied', () => {
      expect(production.productionTime).toEqual(1000)
    })

    test('the store is unchanged', () => {
      expect(store.stocks.wood).toEqual(1)
    })

    test('the upgrade is not requested', () => {
      expect(timeUpgrade.requested).toEqual(false)
    })
  })

  describe('when the demands can be met', () => {
    beforeEach(() => {
      production = new Production({ productionTime: 1000 })
      productionList = new ProductionList({ productions: [production] })
      timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '*', amount: 0.5, requested: true, demands: { wood: 1 } })
      store = new Store({ stocks: { wood: 1 } })
      RunTest()
    })

    test('the demands are taken from the store', () => {
      expect(store.stocks.wood).toEqual(0)
    })
  })

  describe('when the demands are not met', () => {
    beforeEach(() => {
      production = new Production({ productionTime: 1000 })
      productionList = new ProductionList({ productions: [production] })
      timeUpgrade = new SingleUpgrade({ aspect: 'time', operation: '*', amount: 0.5, requested: true, demands: { wood: 2 } })
      store = new Store({ stocks: { wood: 1 } })
      RunTest()
    })

    test('the upgrade is not applied', () => {
      expect(production.productionTime).toEqual(1000)
    })

    test('the store is unchanged', () => {
      expect(store.stocks.wood).toEqual(1)
    })

    test('the upgrade is still requested', () => {
      expect(timeUpgrade.requested).toEqual(true)
    })
  })
})
