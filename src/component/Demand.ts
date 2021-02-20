import { IResourceList } from '../type'
import { GenerateDemands, IComponent } from '../utils'
import { Store } from './Store'

interface Props {
  demands?: {[index: string]: number | undefined}
  store?: Store
  met?: boolean
  consumed?: boolean
  open?: boolean
  working?: boolean
}

export class Demand implements IComponent {
  public readonly type: string = 'Demand'
  public demands: IResourceList
  public store: Store
  public met: boolean
  public consumed: boolean
  public open: boolean
  public working: boolean

  constructor ({ demands, store, met, consumed, open, working }: Props) {
    this.demands = demands === undefined ? {} : GenerateDemands(demands)
    this.store = store ?? new Store({ capacities: this.demands })
    this.met = met ?? false
    this.consumed = consumed ?? false
    this.open = open ?? false
    this.working = working ?? false
  }
}
