import { Demand } from '../component'
import { Entity } from '../utils'
import { Save } from './save'

describe('with save system', () => {
  let data: string
  let entities: Entity[]

  beforeEach(() => {
    entities = []
  })

  const RunTest = (): void => {
    data = Save(entities)
  }

  describe('when given a simple entity', () => {
    beforeEach(() => {
      const entity = new Entity({ id: 'some-id' })
      entity.components.push(new Demand({ consumed: true, demands: { iron: 2 } }))
      entities.push(entity)
      RunTest()
    })

    test('the state is correct', () => {
      expect(data).toEqual('[{"components":[{"type":"Demand","demands":{"iron":2},"store":{"type":"Store","stocks":{},"capacities":{"iron":2},"existed":{}},"met":false,"consumed":true,"open":false,"working":false}],"id":"some-id"}]')
    })
  })

  describe('when given two simple entities', () => {
    beforeEach(() => {
      const entity = new Entity({ id: '' })
      entity.components.push(new Demand({ consumed: true, demands: { iron: 2 } }))
      entities.push(entity)
      entities.push(entity)
      RunTest()
    })

    test('the state contains both entities', () => {
      expect(data).toEqual('[{"components":[{"type":"Demand","demands":{"iron":2},"store":{"type":"Store","stocks":{},"capacities":{"iron":2},"existed":{}},"met":false,"consumed":true,"open":false,"working":false}],"id":""},{"components":[{"type":"Demand","demands":{"iron":2},"store":{"type":"Store","stocks":{},"capacities":{"iron":2},"existed":{}},"met":false,"consumed":true,"open":false,"working":false}],"id":""}]')
    })
  })
})
