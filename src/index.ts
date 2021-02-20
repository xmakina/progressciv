import { Store } from './component'
import { ProgressCiv } from './ProgressCiv'
import { ItemList } from './type'
import { getComponent, HasComponent } from './utils'

export class ProgressCivAPI {
  private readonly progressCiv: ProgressCiv
  public timeout: number = -1
  private lastTime: number = Date.now()

  constructor (itemList: ItemList) {
    this.progressCiv = new ProgressCiv()
    this.progressCiv.NewGame(itemList)
  }

  public Update (): boolean {
    var now = Date.now()
    const delta = now - this.lastTime
    this.lastTime = now

    this.progressCiv.Update(delta)
    return true
  }

  public get Storage (): Store {
    const store = this.progressCiv.entities.filter(HasComponent(Store)).map((e) => getComponent(e, Store))[0]
    return store
  }

  public get Instance (): ProgressCiv {
    return this.progressCiv
  }

  public Save (): string {
    return this.progressCiv.Save()
  }
}
