import { IResourceList } from '../type'
import { IComponent } from '../utils'

interface Props {
  stocks?: IResourceList
  capacities?: IResourceList
  existed?: {[index: string]: boolean}
}

export class Store implements IComponent {
  public readonly type: string = 'Store'
  public stocks: IResourceList
  public capacities: IResourceList
  public existed: {[index: string]: boolean}

  constructor ({ stocks, capacities, existed }: Props) {
    this.stocks = stocks ?? {}
    this.capacities = capacities ?? this.stocks
    this.existed = existed ?? {}
  }
}
