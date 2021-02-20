import { Demand, Store } from '../component'
import { Entity } from '../utils/ecs'
import { StorageDemandSystem } from './StorageDemandSystem'

describe('with storage to demand system', () => {
  let store: Store

  let demand: Demand

  const RunTest = (): void => {
    const regionStore = new Entity()
    regionStore.components.push(store)

    const regionDemand = new Entity()
    regionDemand.components.push(demand)

    const system = new StorageDemandSystem()
    system.update(0, [regionStore, regionDemand])
  }

  describe('when storage is exactly demand', () => {
    beforeEach(() => {
      store = new Store({ stocks: { iron: 5 } })
    })

    describe('when demand is open', () => {
      describe('when demand storage is almost full', () => {
        beforeEach(() => {
          demand = new Demand({
            open: true,
            demands: { iron: 5 },
            store: new Store({ stocks: { iron: 4 }, capacities: { iron: 5 } })
          })
          RunTest()
        })

        test('region storage is reduced by 1', () => {
          expect(store.stocks.iron).toEqual(4)
        })

        test('demand store increased to 5', () => {
          expect(demand.store.stocks.iron).toEqual(5)
        })
      })

      describe('with existing stocks and capacity remaining', () => {
        beforeEach(() => {
          demand = new Demand({ open: true, demands: { iron: 5 }, store: new Store({ stocks: { iron: 5 }, capacities: { iron: 10 } }) })
          RunTest()
        })

        test('external storage is reduced by 5', () => {
          expect(store.stocks.iron).toEqual(0)
        })

        test('demand store is increased by 5', () => {
          expect(demand.store.stocks.iron).toEqual(10)
        })
      })

      describe('with no capacities specified', () => {
        beforeEach(() => {
          demand = new Demand({ open: true, demands: { iron: 5 } })
          RunTest()
        })

        test('external storage is reduced by 5', () => {
          expect(store.stocks.iron).toEqual(0)
        })

        test('demand store increased to 5', () => {
          expect(demand.store.stocks.iron).toEqual(5)
        })

        test('demand capacity is set to requirements', () => {
          expect(demand.store.capacities.iron).toEqual(5)
        })
      })

      describe('when existing storage is full', () => {
        beforeEach(() => {
          demand = new Demand({ open: true, demands: { iron: 5 }, store: new Store({ stocks: { iron: 5 } }) })
          RunTest()
        })

        test('external storage is not changed', () => {
          expect(store.stocks.iron).toEqual(5)
        })

        test('demand store is not changed', () => {
          expect(demand.store.stocks.iron).toEqual(5)
        })
      })

      describe('when storage is over demand', () => {
        beforeEach(() => {
          store = new Store({ stocks: { iron: 10 } })
          demand = new Demand({ open: true, demands: { iron: 5 } })
          RunTest()
        })

        test('external storage is reduced by 5', () => {
          expect(store.stocks.iron).toEqual(5)
        })

        test('demand store increased to 5', () => {
          expect(demand.store.stocks.iron).toEqual(5)
        })
      })

      describe('when storage is under demand', () => {
        beforeEach(() => {
          store = new Store({ stocks: { iron: 4 } })
          demand = new Demand({ open: true, demands: { iron: 5 } })
          RunTest()
        })

        test('external storage is emptied', () => {
          expect(store.stocks.iron).toEqual(0)
        })

        test('demand store is increased by 4', () => {
          expect(demand.store.stocks.iron).toEqual(4)
        })
      })
    })

    describe('when demand is closed', () => {
      describe('when demand storage is almost full', () => {
        beforeEach(() => {
          demand = new Demand({
            open: false,
            demands: { iron: 5 },
            store: new Store({ stocks: { iron: 4 }, capacities: { iron: 5 } })
          })
          RunTest()
        })

        test('storage is untouched', () => {
          expect(store.stocks.iron).toEqual(5)
        })

        test('demand store is untouched', () => {
          expect(demand.store.stocks.iron).toEqual(4)
        })
      })
    })
  })
})
