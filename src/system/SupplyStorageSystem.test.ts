import { Store, Supply } from '../component'
import { Entity } from '../utils'
import { SupplyStorageSystem } from './SupplyStorageSystem'

describe('with supply storage system', () => {
  let store: Store
  let supply: Supply

  const RunTest = (): void => {
    const storeEntity = new Entity()
    storeEntity.components.push(store)

    const supplyEntity = new Entity()
    supplyEntity.components.push(supply)

    const system = new SupplyStorageSystem()
    system.update(0, [storeEntity, supplyEntity])
  }

  describe('when there is something in the supply store', () => {
    beforeEach(() => {
      supply = new Supply({
        product: { resource: 'iron', quantity: 1 },
        store: new Store({ stocks: { iron: 5 } })
      })
    })

    describe('when there is capacity in the global store', () => {
      beforeEach(() => {
        store = new Store({ capacities: { iron: 5 } })
        RunTest()
      })

      test('it empties the supply store', () => {
        expect(supply.store.stocks.iron).toEqual(0)
      })

      test('it adds to the external store', () => {
        expect(store.stocks.iron).toEqual(5)
      })

      test('it marks the resource as having been created', () => {
        expect(store.existed.iron).toEqual(true)
      })
    })

    describe('when there no capacity in the global store', () => {
      beforeEach(() => {
        store = new Store({})
        RunTest()
      })

      test('it does not change the supply store', () => {
        expect(supply.store.stocks.iron).toEqual(5)
      })

      test('it does not change the global store', () => {
        expect(store.stocks.iron).toBeUndefined()
      })
    })
  })

  describe('when there is nothing in the supply store', () => {
    beforeEach(() => {
      supply = new Supply({ product: { resource: 'iron', quantity: 1 } })
    })

    describe('when there is capacity in the global store', () => {
      beforeEach(() => {
        store = new Store({ stocks: { iron: 5 }, capacities: { iron: 10 } })
        RunTest()
      })

      test('it does not change the global store', () => {
        expect(store.stocks.iron).toEqual(5)
      })
    })

    describe('when there is no capacity in the global store', () => {
      beforeEach(() => {
        store = new Store({})
        RunTest()
      })

      test('it does not change the global store', () => {
        expect(store.stocks.iron).toBeUndefined()
      })
    })
  })
})
