import { Demand, ProductionList, Supply, Upgrade } from '../component'
import { ItemList } from '../type'
import { CreateProductionEntities } from './CreateProductionEntities'
import { Entity, getComponent } from './ecs'

describe('with Create Production Entities', () => {
  describe('when given a minimal valid json', () => {
    const items: ItemList = { items: [{ product: 'wheat', quantity: 2, time: 2000, startingActive: 1 }] }

    let result: Entity[]

    beforeEach(() => {
      result = CreateProductionEntities(items)
    })

    test('the production time is set correctly', () => {
      const p = getComponent(result[0], ProductionList)
      expect(p.productionTime).toEqual(2000)
      expect(p.productions[0].productionTime).toEqual(2000)
    })

    test('the supply quantity is set correctly', () => {
      const s = getComponent(result[0], Supply)
      expect(s.product.resource).toEqual('wheat')
      expect(s.product.quantity).toEqual(2)
    })
  })

  describe('when given an item with upgrades', () => {
    const items: ItemList = {
      items: [
        {
          product: 'wheat',
          quantity: 2,
          time: 1000,
          startingActive: 1,
          upgrades: [{
            aspect: 'quantity',
            amount: 2,
            operation: '+',
            demands: { 'wheat farm': 1 }
          }, {
            aspect: 'time',
            amount: 0.80,
            operation: '*',
            demands: { worker: 1 }
          }]
        }]
    }

    let result: Entity[]

    beforeEach(() => {
      result = CreateProductionEntities(items)
    })

    test('the first upgrade is set correctly', () => {
      const uc = getComponent(result[0], Upgrade)
      const u = uc.upgrades[0]
      expect(u.aspect).toEqual('quantity')
      expect(u.amount).toEqual(2)
      expect(u.operation).toEqual('+')
      expect(u.demands['wheat farm']).toEqual(1)
    })

    test('the second upgrade is set correctly', () => {
      const uc = getComponent(result[0], Upgrade)
      const u = uc.upgrades[1]
      expect(u.aspect).toEqual('time')
      expect(u.amount).toEqual(0.8)
      expect(u.operation).toEqual('*')
      expect(u.demands.worker).toEqual(1)
    })
  })

  describe('when given an item with demands', () => {
    const items: ItemList = { items: [{ product: 'worker', quantity: 2, time: 1000, startingActive: 1, demands: { wheat: 10 } }] }
    let result: Entity[]

    beforeEach(() => {
      result = CreateProductionEntities(items)
    })

    test('the production time is set correctly', () => {
      const p = getComponent(result[0], ProductionList)
      expect(p.productions[0].productionTime).toEqual(1000)
    })

    test('the supply quantity is set correctly', () => {
      const s = getComponent(result[0], Supply)
      expect(s.product.resource).toEqual('worker')
      expect(s.product.quantity).toEqual(2)
    })

    test('the demand is set correctly', () => {
      const d = getComponent(result[0], Demand)
      expect(d.demands.wheat).toEqual(10)
    })
  })
})
