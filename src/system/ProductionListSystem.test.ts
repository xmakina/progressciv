import { Demand, Production, ProductionList } from '../component'
import { Entity } from '../utils'
import { ProductionListSystem } from './ProductionListSystem'

describe('with production system', () => {
  let demand: Demand
  let productionList: ProductionList
  let production: Production
  let mockEntity: Entity
  const system = new ProductionListSystem()
  const msElapsed = 10

  const RunTest = (productionList: ProductionList, demand?: Demand): void => {
    const mockEntity = new Entity()
    mockEntity.components.push(productionList)

    if (demand !== undefined) {
      mockEntity.components.push(demand)
    }

    system.update(msElapsed, [mockEntity])
  }

  describe('when production has not started', () => {
    beforeEach(() => {
      production = new Production({ progress: 0 })
      productionList = new ProductionList({ productions: [production], maximumActive: 1, currentActive: 1 })
    })

    describe('when demands are not met', () => {
      beforeEach(() => {
        demand = new Demand({ met: false })

        mockEntity = new Entity()
        mockEntity.components.push(demand)
        mockEntity.components.push(productionList)

        system.update(msElapsed, [mockEntity])
      })

      test('demand is not consumed', () => {
        expect(demand.consumed).toEqual(false)
      })

      test('production does not start', () => {
        expect(production.progress).toEqual(0)
      })
    })

    describe('when demands have been met', () => {
      describe('when demand has is working', () => {
        beforeEach(() => {
          demand = new Demand({ met: true, consumed: false, working: true })

          mockEntity = new Entity()
          mockEntity.components.push(demand)
          mockEntity.components.push(productionList)

          system.update(msElapsed, [mockEntity])
        })

        test('demand is marked as consumed', () => {
          expect(demand.consumed).toEqual(true)
        })

        test('the production is started', () => {
          expect(production.progress).toEqual(msElapsed)
        })
      })

      describe('when demand is not working', () => {
        beforeEach(() => {
          demand = new Demand({ met: true, consumed: false, working: false })

          mockEntity = new Entity()
          mockEntity.components.push(demand)
          mockEntity.components.push(productionList)

          system.update(msElapsed, [mockEntity])
        })

        test('demand is note marked as consumed', () => {
          expect(demand.consumed).toEqual(false)
        })

        test('the production has not started', () => {
          expect(production.progress).toEqual(0)
        })
      })
    })
  })

  describe('when production has started', () => {
    const progress: number = 1

    beforeEach(() => {
      production = new Production({ progress })
      productionList = new ProductionList({ productions: [production] })

      mockEntity = new Entity()
      mockEntity.components.push(productionList)

      system.update(msElapsed, [mockEntity])
    })

    test('production continues', () => {
      expect(production.progress).toEqual(msElapsed + progress)
    })
  })

  describe('when there are multiple productions', () => {
    const progress: number = 1
    let productionTwo: Production
    let productionThree: Production

    beforeEach(() => {
      production = new Production({ progress })
      productionTwo = new Production({ progress })
      productionThree = new Production({ working: false, progress: 0 })
      productionList = new ProductionList({ productions: [production, productionTwo, productionThree], maximumActive: 3, currentActive: 2 })

      mockEntity = new Entity()
      mockEntity.components.push(productionList)

      system.update(msElapsed, [mockEntity])
    })

    test('production continues', () => {
      expect(production.progress).toEqual(msElapsed + progress)
    })

    test('production two continues', () => {
      expect(productionTwo.progress).toEqual(msElapsed + progress)
    })

    test('production three does not start', () => {
      expect(productionThree.progress).toEqual(0)
      expect(productionThree.working).toEqual(false)
    })
  })

  describe('when production finishes', () => {
    describe('with the exact number of milliseconds', () => {
      beforeEach(() => {
        production = new Production({ productionTime: 11, progress: 1 })
        productionList = new ProductionList({ productionTime: 11, productions: [production] })
        demand = new Demand({ working: true })
        mockEntity = new Entity()
        mockEntity.components.push(productionList)
        mockEntity.components.push(demand)

        system.update(msElapsed, [mockEntity])
      })

      test('production is marked as completed', () => {
        expect(production.productionComplete).toEqual(true)
      })

      test('working is left alone', () => {
        expect(demand.working).toEqual(true)
      })

      test('progress is increased by milliseconds', () => {
        expect(production.progress).toEqual(11)
      })
    })

    describe('with an overflow of milliseconds', () => {
      beforeEach(() => {
        production = new Production({ productionTime: 11, progress: 11 })
        productionList = new ProductionList({ productionTime: 11, productions: [production] })
        RunTest(productionList)
      })

      test('production is marked as completed', () => {
        expect(production.productionComplete).toEqual(true)
      })

      test('progress holds the excess milliseconds', () => {
        expect(production.progress).toEqual(21)
      })
    })
  })

  describe('when the production has finished', () => {
    beforeEach(() => {
      production = new Production({ productionComplete: true })
      productionList = new ProductionList({ productions: [production], maximumActive: 1, currentActive: 1 })

      RunTest(productionList)
    })

    test('no progress is added', () => {
      expect(production.progress).toEqual(0)
    })
  })

  describe('when the production is consumed', () => {
    beforeEach(() => {
      production = new Production({ consumed: true, progress: 21, productionTime: 20 })
      productionList = new ProductionList({ productions: [production], maximumActive: 1, currentActive: 1 })
    })

    describe('when demand is not met', () => {
      beforeEach(() => {
        demand = new Demand({ met: false })

        RunTest(productionList, demand)
      })

      test('progress is returned to zero', () => {
        expect(production.progress).toEqual(0)
      })

      test('completed is cleared', () => {
        expect(production.productionComplete).toEqual(false)
      })

      test('consumed is cleared', () => {
        expect(production.consumed).toEqual(false)
      })
    })

    describe('when demand is met', () => {
      describe('when demand is working', () => {
        beforeEach(() => {
          demand = new Demand({ met: true, consumed: false, working: true })
          RunTest(productionList, demand)
        })

        test('excess progress is used', () => {
          expect(production.progress).toEqual(11)
        })

        test('completed is cleared', () => {
          expect(production.productionComplete).toEqual(false)
        })

        test('consumed is cleared', () => {
          expect(production.consumed).toEqual(false)
        })
      })

      describe('when demand has not been working', () => {
        beforeEach(() => {
          demand = new Demand({ met: true, consumed: false, working: false })
          RunTest(productionList, demand)
        })

        test('progress is returned to zero', () => {
          expect(production.progress).toEqual(0)
        })

        test('completed is cleared', () => {
          expect(production.productionComplete).toEqual(false)
        })

        test('consumed is cleared', () => {
          expect(production.consumed).toEqual(false)
        })
      })
    })
  })

  describe('when maximum active has increased', () => {
    beforeEach(() => {
      productionList = new ProductionList({ maximumActive: 1, currentActive: 1, productionTime: 5000 })

      RunTest(productionList)
      productionList.maximumActive = 2
      RunTest(productionList)
    })

    test('new production has correct production time', () => {
      expect(productionList.productions[0].productionTime).toEqual(5000)
      expect(productionList.productions[1].productionTime).toEqual(5000)
    })
  })
})
