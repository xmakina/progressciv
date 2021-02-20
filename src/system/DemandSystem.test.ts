import { DemandSystem } from '.'
import { Demand, Store } from '../component'
import { Entity } from '../utils'

describe('with demand system', () => {
  let demand: Demand
  let mockEntity: Entity
  const system = new DemandSystem()

  describe('when demands are exceeded', () => {
    beforeEach(() => {
      demand = new Demand({ demands: { iron: 5 }, store: new Store({ stocks: { iron: 6 } }) })

      mockEntity = new Entity()
      mockEntity.components.push(demand)

      system.update(10, [mockEntity])
    })

    test('the demand is marked as met', () => {
      expect(demand.met).toEqual(true)
    })
  })

  describe('when demands are met', () => {
    beforeEach(() => {
      demand = new Demand({ demands: { iron: 5 }, store: new Store({ stocks: { iron: 5 } }) })

      mockEntity = new Entity()
      mockEntity.components.push(demand)

      system.update(10, [mockEntity])
    })

    test('the demand is marked as met', () => {
      expect(demand.met).toEqual(true)
    })
  })

  describe('when demands are not met', () => {
    beforeEach(() => {
      demand = new Demand({ demands: { iron: 5 }, store: new Store({ stocks: { iron: 4 } }) })

      mockEntity = new Entity()
      mockEntity.components.push(demand)

      system.update(10, [mockEntity])
    })

    test('the demand is not marked as met', () => {
      expect(demand.met).toEqual(false)
    })
  })

  describe('when demand is marked for consumption', () => {
    describe('when there is twice the requirement in store', () => {
      beforeEach(() => {
        demand = new Demand({ demands: { iron: 5 }, store: new Store({ stocks: { iron: 10 } }), met: true, consumed: true })

        mockEntity = new Entity()
        mockEntity.components.push(demand)

        system.update(10, [mockEntity])
      })

      test('the store is reduced by the requirements', () => {
        expect(demand.store.stocks.iron).toEqual(5)
      })

      test('the consume flag is cleared', () => {
        expect(demand.consumed).toEqual(false)
      })

      test('the met flag is still set', () => {
        expect(demand.met).toEqual(true)
      })
    })

    describe('when there is less than double the requirement in store', () => {
      beforeEach(() => {
        demand = new Demand({ demands: { iron: 5 }, store: new Store({ stocks: { iron: 9 } }), met: true, consumed: true })

        mockEntity = new Entity()
        mockEntity.components.push(demand)

        system.update(10, [mockEntity])
      })

      test('the store is reduced by the requirements', () => {
        expect(demand.store.stocks.iron).toEqual(4)
      })

      test('the consume flag is cleared', () => {
        expect(demand.consumed).toEqual(false)
      })

      test('the met flag is cleared', () => {
        expect(demand.met).toEqual(false)
      })
    })
  })
})
