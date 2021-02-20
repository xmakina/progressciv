import { Store } from './component'
import { ProgressCiv } from './ProgressCiv'
import { getComponent, HasComponent } from './utils'
import * as TestItems from './TestItems.json'

describe('with ProgressCiv', () => {
  let progressCiv: ProgressCiv

  describe('when starting a new game', () => {
    beforeEach(() => {
      progressCiv = new ProgressCiv()
      progressCiv.NewGame(TestItems)
    })

    test('there is player storage', () => {
      const storage = getComponent(progressCiv.entities.filter(HasComponent(Store))[0], Store)
      expect(storage.capacities.wheat).toEqual(200)
      expect(storage.capacities.wood).toEqual(100)
      expect(storage.capacities.worker).toEqual(100)
      expect(storage.capacities['wheat farm']).toEqual(100)
      expect(storage.capacities.forest).toEqual(100)
    })

    test('new construction entities exist', () => {
      expect(progressCiv.entities.length).toEqual(6)
    })
  })
})
