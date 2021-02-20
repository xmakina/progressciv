import { Store } from '.'
import { IResourceList, Resource } from '../type'
import { IComponent } from '../utils'

interface Props {
  product?: Resource
  store?: Store
}

export class Supply implements IComponent {
  public readonly type: string = 'Supply'
  public product: Resource
  public store: Store

  constructor (props: Props = {}) {
    this.product = props.product ?? { resource: 'unknown', quantity: 0 }
    const capacities: IResourceList = {}
    capacities[this.product.resource] = this.product.quantity
    this.store = props.store ?? new Store({ capacities })
  }
}
