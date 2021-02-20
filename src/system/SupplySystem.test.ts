import { SupplySystem } from '.'
import { Production, ProductionList, Store, Supply } from '../component'
import { Entity } from '../utils'

describe('with supply system', () => {
  let supply: Supply
  let production: Production
  let productionList: ProductionList
  const system = new SupplySystem()

  const RunTest = (supply: Supply, production?: Production): void => {
    const mockEntity = new Entity()
    mockEntity.components.push(supply)

    if (production !== undefined) {
      productionList = new ProductionList({ productions: [production] })
      mockEntity.components.push(productionList)
    }

    system.update(0, [mockEntity])
  }

  describe('when production is ready', () => {
    beforeEach(() => {
      production = new Production({ productionComplete: true })
    })

    describe('when there is store space', () => {
      beforeEach(() => {
        supply = new Supply({ product: { resource: 'gear', quantity: 2 } })
        RunTest(supply, production)
      })

      test('it adds the products to the store', () => {
        expect(supply.store.stocks.gear).toEqual(2)
      })

      test('it marks production as consumed', () => {
        expect(production.consumed).toEqual(true)
      })
    })

    describe('when the store is full', () => {
      beforeEach(() => {
        supply = new Supply({ product: { resource: 'gear', quantity: 2 }, store: new Store({ stocks: { gear: 2 } }) })
        RunTest(supply, production)
      })

      test('it does not add anything to the store', () => {
        expect(supply.store.stocks.gear).toEqual(2)
      })

      test('it does not mark the production as consumed', () => {
        expect(production.consumed).toEqual(false)
      })
    })

    describe('when the store is nearly full', () => {
      beforeEach(() => {
        supply = new Supply({ product: { resource: 'gear', quantity: 2 }, store: new Store({ stocks: { gear: 3 }, capacities: { gear: 4 } }) })
        RunTest(supply, production)
      })

      test('it does not add anything to the store', () => {
        expect(supply.store.stocks.gear).toEqual(3)
      })

      test('it does not mark the production as consumed', () => {
        expect(production.consumed).toEqual(false)
      })
    })
  })

  describe('when production is not ready', () => {
    beforeEach(() => {
      production = new Production({ productionComplete: false })
      supply = new Supply()
      RunTest(supply, production)
    })

    test('it does not add any products', () => {
      expect(supply.store.stocks.gear).toBeUndefined()
    })
  })
})
