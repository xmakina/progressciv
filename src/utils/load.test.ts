import { Demand } from '../component'
import { Entity, getComponent, hasComponent } from '../utils'
import { Load } from './load'

describe('with Load System', () => {
  let state: string
  let entites: Entity[]

  const RunTest = (): void => {
    entites = Load(state)
  }

  describe('when given a simple JSON', () => {
    beforeEach(() => {
      state = '[{"components":[{"type":"Demand","demands":{"iron":2},"store":{"type":"Store","stocks":{},"capacities":{"iron":2}},"met":false,"consumed":true}]}]'
      RunTest()
    })

    test('an entity is added', () => {
      expect(entites.length).toEqual(1)
    })

    describe('with the loaded entity', () => {
      let e: Entity
      beforeEach(() => {
        e = entites[0]
      })

      test('the entity has the correct components', () => {
        expect(hasComponent(e, Demand)).toEqual(true)
      })

      describe('with the component', () => {
        let d: Demand
        beforeEach(() => {
          d = getComponent(e, Demand)
        })

        test('it has the correct values', () => {
          expect(d.demands.iron).toEqual(2)
          expect(d.store.capacities.iron).toEqual(2)
          expect(d.consumed).toEqual(true)
        })
      })
    })
  })
})
